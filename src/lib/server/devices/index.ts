import { randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { sendAlert } from '$lib/server/mail';
import { loadDevices, type DeviceConfig } from './keys';
import { startDeviceListener, type DeviceListener } from './listener';
import { Watchdog } from './watchdog';

export interface DeviceStatus {
  id: string;
  name: string;
  connected: boolean;
  online: boolean;
  lastSeen: Date | null;
  firmware: string | null;
  sensors: Record<string, boolean>;
}

interface DeviceRuntime {
  devices: Map<string, DeviceConfig>;
  listener: DeviceListener;
  watchdog: Watchdog;
  firmware: Map<string, string>;
  sensors: Map<string, Record<string, boolean>>;
}

// Device events that trigger an alert mail; all other events are only logged.
const ALERT_EVENTS = new Set(['alarm']);

// Kept on globalThis so Vite's hot module reloading does not start a second listener.
const globalState = globalThis as typeof globalThis & { __authlockDevices?: Promise<DeviceRuntime> };

export function startDevices(): Promise<DeviceRuntime> {
  globalState.__authlockDevices ??= start();
  return globalState.__authlockDevices;
}

async function start(): Promise<DeviceRuntime> {
  const devices = loadDevices(env.AUTHLOCK_DEVICES_FILE ?? 'devices.json');
  const firmware = new Map<string, string>();
  const sensors = new Map<string, Record<string, boolean>>();
  const nameOf = (id: string) => devices.get(id)?.name ?? id;

  const watchdog = new Watchdog({
    timeoutMs: Number(env.HEARTBEAT_TIMEOUT_MS ?? 15_000),
    onLost: (id, lastSeen) =>
      void sendAlert(
        `Heartbeat lost: ${nameOf(id)}`,
        `No heartbeat from "${nameOf(id)}" (${id}) since ${new Date(lastSeen).toISOString()}.\n` +
          'The device may be vandalized, without power or disconnected from the network.'
      ),
    onRecovered: (id, downMs) =>
      void sendAlert(
        `Heartbeat restored: ${nameOf(id)}`,
        `"${nameOf(id)}" (${id}) is reachable again after ${Math.round(downMs / 1000)} s.`
      )
  });
  for (const id of devices.keys()) watchdog.watch(id);
  watchdog.start();

  const port = Number(env.DEVICE_PORT ?? 7443);
  const listener = await startDeviceListener({
    port,
    host: env.DEVICE_HOST,
    getKey: (id) => devices.get(id)?.key ?? null,
    onMessage: (id, message) => {
      watchdog.seen(id);
      switch (message.t) {
        case 'hello':
          firmware.set(id, message.fw);
          break;
        case 'hb':
          if (message.sensors) sensors.set(id, message.sensors);
          break;
        case 'event':
          console.log(`[devices] ${id} reported ${message.name}`);
          if (!ALERT_EVENTS.has(message.name)) break;
          void sendAlert(
            `${message.name} on ${nameOf(id)}`,
            `"${nameOf(id)}" (${id}) reported "${message.name}"` +
              (message.detail ? `: ${message.detail}` : '.')
          );
          break;
        case 'ack':
          break;
      }
    }
  });

  console.log(`[devices] Listening for ${devices.size} device(s) on port ${port}`);
  return { devices, listener, watchdog, firmware, sensors };
}

export async function getDeviceStatuses(): Promise<DeviceStatus[]> {
  const runtime = await startDevices();
  return [...runtime.devices.values()].map((device) => ({
    id: device.id,
    name: device.name,
    connected: runtime.listener.isConnected(device.id),
    ...runtime.watchdog.status(device.id),
    firmware: runtime.firmware.get(device.id) ?? null,
    sensors: runtime.sensors.get(device.id) ?? {}
  }));
}

/** Asks a device to unlock. Authorization must be checked by the caller. */
export async function openDevice(deviceId: string, ttlSeconds = 10): Promise<boolean> {
  const runtime = await startDevices();
  return runtime.listener.send(deviceId, { t: 'open', id: randomUUID(), ttl: ttlSeconds });
}

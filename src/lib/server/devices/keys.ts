import { readFileSync } from 'node:fs';

export interface DeviceConfig {
  id: string;
  name: string;
  key: Buffer;
}

interface DevicesFile {
  devices: { id: string; name?: string; key: string }[];
}

// PSK identities are sent in clear text during the handshake, so ids must not leak secrets.
const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const KEY_PATTERN = /^[0-9a-fA-F]{64}$/;

/** Loads device ids and their 256-bit pre-shared keys (hex encoded) from a JSON file. */
export function loadDevices(path: string): Map<string, DeviceConfig> {
  const file = JSON.parse(readFileSync(path, 'utf8')) as DevicesFile;
  const devices = new Map<string, DeviceConfig>();

  for (const entry of file.devices ?? []) {
    if (!ID_PATTERN.test(entry.id)) {
      throw new Error(`Invalid device id "${entry.id}" in ${path}`);
    }
    if (!KEY_PATTERN.test(entry.key)) {
      throw new Error(`Device "${entry.id}" in ${path} needs a 64 character hex key`);
    }
    if (devices.has(entry.id)) {
      throw new Error(`Duplicate device id "${entry.id}" in ${path}`);
    }
    devices.set(entry.id, {
      id: entry.id,
      name: entry.name ?? entry.id,
      key: Buffer.from(entry.key, 'hex')
    });
  }

  return devices;
}

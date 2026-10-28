import tls from 'node:tls';
import { LineSplitter, parseDeviceMessage, type DeviceMessage, type ServerMessage } from './protocol';

// Only ECDHE-PSK (TLS 1.2) and TLS 1.3 suites: plain PSK suites lack forward secrecy.
const CIPHERS = [
  'TLS_AES_128_GCM_SHA256',
  'TLS_AES_256_GCM_SHA384',
  'TLS_CHACHA20_POLY1305_SHA256',
  'ECDHE-PSK-CHACHA20-POLY1305',
  'ECDHE-PSK-AES128-CBC-SHA256'
].join(':');

// Drops connections that stay silent this long; detects half-open TCP connections.
const IDLE_TIMEOUT_MS = 15_000;

export interface DeviceListenerOptions {
  port: number;
  host?: string;
  getKey: (deviceId: string) => Buffer | null;
  onConnect?: (deviceId: string) => void;
  onMessage: (deviceId: string, message: DeviceMessage) => void;
  onDisconnect?: (deviceId: string) => void;
  log?: (message: string) => void;
}

export interface DeviceListener {
  server: tls.Server;
  send: (deviceId: string, message: ServerMessage) => boolean;
  isConnected: (deviceId: string) => boolean;
  close: () => Promise<void>;
}

export function startDeviceListener(options: DeviceListenerOptions): Promise<DeviceListener> {
  const log = options.log ?? ((message: string) => console.log(`[devices] ${message}`));
  const identities = new WeakMap<tls.TLSSocket, string>();
  const connections = new Map<string, tls.TLSSocket>();

  const server = tls.createServer(
    {
      ciphers: CIPHERS,
      minVersion: 'TLSv1.2',
      pskCallback: (socket, identity) => {
        const key = options.getKey(identity);
        if (key) identities.set(socket, identity);
        return key;
      }
    },
    (socket) => {
      const deviceId = identities.get(socket);
      if (!deviceId) {
        socket.destroy();
        return;
      }

      // A device reconnecting after a network drop replaces its stale connection.
      connections.get(deviceId)?.destroy();
      connections.set(deviceId, socket);
      log(`${deviceId} connected from ${socket.remoteAddress} (${socket.getProtocol()})`);
      options.onConnect?.(deviceId);

      socket.setEncoding('utf8');
      socket.setKeepAlive(true, 5_000);
      socket.setTimeout(IDLE_TIMEOUT_MS, () => {
        log(`${deviceId} idle for ${IDLE_TIMEOUT_MS} ms, closing connection`);
        socket.destroy();
      });

      const splitter = new LineSplitter((line) => {
        const message = parseDeviceMessage(line);
        if (message) options.onMessage(deviceId, message);
        else log(`${deviceId} sent an invalid message`);
      });
      socket.on('data', (chunk: string) => {
        if (!splitter.push(chunk)) {
          log(`${deviceId} exceeded the maximum message size, closing connection`);
          socket.destroy();
        }
      });

      socket.on('error', (err) => log(`${deviceId} connection error: ${err.message}`));
      socket.on('close', () => {
        if (connections.get(deviceId) !== socket) return;
        connections.delete(deviceId);
        log(`${deviceId} disconnected`);
        options.onDisconnect?.(deviceId);
      });
    }
  );

  server.on('tlsClientError', (err, socket) => {
    log(`Rejected handshake from ${socket.remoteAddress}: ${err.message}`);
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port, options.host, () => {
      server.off('error', reject);
      resolve({
        server,
        send: (deviceId, message) => {
          const socket = connections.get(deviceId);
          if (!socket) return false;
          socket.write(JSON.stringify(message) + '\n');
          return true;
        },
        isConnected: (deviceId) => connections.has(deviceId),
        close: () =>
          new Promise((done) => {
            for (const socket of connections.values()) socket.destroy();
            server.close(() => done());
          })
      });
    });
  });
}

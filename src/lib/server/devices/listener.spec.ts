import tls from 'node:tls';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { startDeviceListener, type DeviceListener } from './listener';

const KEY = Buffer.alloc(32, 7);

function connect(port: number, identity: string, key: Buffer, maxVersion: tls.SecureVersion) {
  return tls.connect({
    port,
    host: '127.0.0.1',
    maxVersion,
    ciphers: 'ECDHE-PSK-CHACHA20-POLY1305:TLS_AES_128_GCM_SHA256',
    checkServerIdentity: () => undefined,
    pskCallback: () => ({ psk: key, identity })
  });
}

describe('startDeviceListener', () => {
  let listener: DeviceListener | undefined;
  afterEach(() => listener?.close());

  async function start() {
    const onMessage = vi.fn();
    listener = await startDeviceListener({
      port: 0,
      host: '127.0.0.1',
      getKey: (id) => (id === 'vault' ? KEY : null),
      onMessage,
      log: () => {}
    });
    const port = (listener.server.address() as { port: number }).port;
    return { listener, port, onMessage };
  }

  it.each(['TLSv1.2', 'TLSv1.3'] as const)('accepts devices with the right key (%s)', async (v) => {
    const { listener, port, onMessage } = await start();
    const client = connect(port, 'vault', KEY, v);
    const received = new Promise<string>((resolve) => client.on('data', (d) => resolve(String(d))));

    client.write('{"t":"hello","fw":"1.0"}\n{"t":"hb"}\n');
    await vi.waitFor(() => expect(onMessage).toHaveBeenCalledTimes(2));
    expect(onMessage).toHaveBeenNthCalledWith(1, 'vault', { t: 'hello', fw: '1.0' });

    expect(listener.send('vault', { t: 'open', id: 'abc', ttl: 10 })).toBe(true);
    expect(JSON.parse(await received)).toEqual({ t: 'open', id: 'abc', ttl: 10 });
    client.destroy();
  });

  it('rejects unknown identities and wrong keys', async () => {
    const { listener, port, onMessage } = await start();
    for (const [identity, key] of [
      ['intruder', KEY],
      ['vault', Buffer.alloc(32, 1)]
    ] as const) {
      const client = connect(port, identity, key, 'TLSv1.2');
      await new Promise((resolve) => client.on('error', resolve).on('close', resolve));
    }
    expect(listener.isConnected('vault')).toBe(false);
    expect(onMessage).not.toHaveBeenCalled();
  });
});

// Wire protocol between the server and lock devices: newline-delimited JSON over a
// TLS-PSK connection. TLS already provides confidentiality, integrity and replay
// protection, so messages carry no additional signatures.

export const MAX_LINE_BYTES = 1024;

export type DeviceMessage =
  | { t: 'hello'; fw: string }
  | { t: 'hb'; sensors?: Record<string, boolean> }
  | { t: 'event'; name: string; detail?: string }
  | { t: 'ack'; id: string; ok: boolean };

export type ServerMessage = { t: 'open'; id: string; ttl: number };

export function parseDeviceMessage(line: string): DeviceMessage | null {
  let msg: unknown;
  try {
    msg = JSON.parse(line);
  } catch {
    return null;
  }
  if (typeof msg !== 'object' || msg === null) return null;
  const m = msg as Record<string, unknown>;

  switch (m.t) {
    case 'hello':
      return typeof m.fw === 'string' ? { t: 'hello', fw: m.fw } : null;
    case 'hb':
      if (m.sensors === undefined) return { t: 'hb' };
      return isSensorMap(m.sensors) ? { t: 'hb', sensors: m.sensors } : null;
    case 'event':
      if (typeof m.name !== 'string') return null;
      if (m.detail !== undefined && typeof m.detail !== 'string') return null;
      return { t: 'event', name: m.name, detail: m.detail };
    case 'ack':
      if (typeof m.id !== 'string' || typeof m.ok !== 'boolean') return null;
      return { t: 'ack', id: m.id, ok: m.ok };
    default:
      return null;
  }
}

function isSensorMap(value: unknown): value is Record<string, boolean> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((v) => typeof v === 'boolean')
  );
}

/** Splits a byte stream into lines; returns false once a line exceeds MAX_LINE_BYTES. */
export class LineSplitter {
  private buffer = '';

  constructor(private onLine: (line: string) => void) {}

  push(chunk: string): boolean {
    this.buffer += chunk;
    let newline: number;
    while ((newline = this.buffer.indexOf('\n')) !== -1) {
      const line = this.buffer.slice(0, newline).trim();
      this.buffer = this.buffer.slice(newline + 1);
      if (line.length > MAX_LINE_BYTES) return false;
      if (line) this.onLine(line);
    }
    return this.buffer.length <= MAX_LINE_BYTES;
  }
}

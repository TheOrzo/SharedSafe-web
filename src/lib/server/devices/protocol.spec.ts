import { describe, expect, it } from 'vitest';
import { LineSplitter, MAX_LINE_BYTES, parseDeviceMessage } from './protocol';

describe('parseDeviceMessage', () => {
  it('parses valid messages', () => {
    expect(parseDeviceMessage('{"t":"hello","fw":"0.1.0"}')).toEqual({ t: 'hello', fw: '0.1.0' });
    expect(parseDeviceMessage('{"t":"hb"}')).toEqual({ t: 'hb' });
    expect(parseDeviceMessage('{"t":"hb","sensors":{"door":true}}')).toEqual({
      t: 'hb',
      sensors: { door: true }
    });
    expect(parseDeviceMessage('{"t":"event","name":"alarm"}')).toEqual({
      t: 'event',
      name: 'alarm',
      detail: undefined
    });
  });

  it('rejects malformed messages', () => {
    expect(parseDeviceMessage('not json')).toBeNull();
    expect(parseDeviceMessage('null')).toBeNull();
    expect(parseDeviceMessage('{"t":"unknown"}')).toBeNull();
    expect(parseDeviceMessage('{"t":"hello"}')).toBeNull();
    expect(parseDeviceMessage('{"t":"hb","sensors":{"door":"open"}}')).toBeNull();
    expect(parseDeviceMessage('{"t":"ack","id":"x"}')).toBeNull();
  });
});

describe('LineSplitter', () => {
  it('reassembles lines split across chunks', () => {
    const lines: string[] = [];
    const splitter = new LineSplitter((line) => lines.push(line));
    expect(splitter.push('{"t":')).toBe(true);
    expect(splitter.push('"hb"}\n\n{"t":"hb"}\n{"t"')).toBe(true);
    expect(lines).toEqual(['{"t":"hb"}', '{"t":"hb"}']);
  });

  it('rejects oversized lines', () => {
    const splitter = new LineSplitter(() => {});
    expect(splitter.push('x'.repeat(MAX_LINE_BYTES + 1))).toBe(false);
  });
});

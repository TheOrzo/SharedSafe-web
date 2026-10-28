import { describe, expect, it, vi } from 'vitest';
import { Watchdog } from './watchdog';

function setup() {
  let now = 0;
  const onLost = vi.fn();
  const onRecovered = vi.fn();
  const watchdog = new Watchdog({ timeoutMs: 15_000, onLost, onRecovered, now: () => now });
  return { watchdog, onLost, onRecovered, advance: (ms: number) => (now += ms) };
}

describe('Watchdog', () => {
  it('stays quiet while heartbeats arrive', () => {
    const { watchdog, onLost, advance } = setup();
    watchdog.watch('vault');
    for (let i = 0; i < 10; i++) {
      advance(5_000);
      watchdog.seen('vault');
      watchdog.check();
    }
    expect(onLost).not.toHaveBeenCalled();
    expect(watchdog.status('vault').online).toBe(true);
  });

  it('reports a lost device once and its recovery once', () => {
    const { watchdog, onLost, onRecovered, advance } = setup();
    watchdog.seen('vault');

    advance(16_000);
    watchdog.check();
    advance(5_000);
    watchdog.check();
    expect(onLost).toHaveBeenCalledTimes(1);
    expect(onLost).toHaveBeenCalledWith('vault', 0);
    expect(watchdog.status('vault').online).toBe(false);

    watchdog.seen('vault');
    watchdog.seen('vault');
    expect(onRecovered).toHaveBeenCalledTimes(1);
    expect(onRecovered).toHaveBeenCalledWith('vault', 21_000);
    expect(watchdog.status('vault').online).toBe(true);
  });

  it('reports watched devices that never connect', () => {
    const { watchdog, onLost, advance } = setup();
    watchdog.watch('vault');
    advance(15_000);
    watchdog.check();
    expect(onLost).not.toHaveBeenCalled();
    advance(1);
    watchdog.check();
    expect(onLost).toHaveBeenCalledOnce();
  });
});

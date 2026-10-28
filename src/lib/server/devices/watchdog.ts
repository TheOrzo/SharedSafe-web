export interface WatchdogOptions {
  timeoutMs: number;
  onLost: (deviceId: string, lastSeen: number) => void;
  onRecovered: (deviceId: string, downMs: number) => void;
  now?: () => number;
}

/**
 * Tracks the last heartbeat of every device and reports devices whose heartbeat stopped.
 * Each outage is reported once via onLost and once via onRecovered.
 */
export class Watchdog {
  private lastSeen = new Map<string, number>();
  private lost = new Set<string>();
  private now: () => number;

  constructor(private options: WatchdogOptions) {
    this.now = options.now ?? Date.now;
  }

  /**
   * Starts watching a device as if it was just seen, so a device that never connects
   * after a server start is reported once the timeout elapsed.
   */
  watch(deviceId: string) {
    if (!this.lastSeen.has(deviceId)) this.lastSeen.set(deviceId, this.now());
  }

  seen(deviceId: string) {
    const now = this.now();
    if (this.lost.delete(deviceId)) {
      this.options.onRecovered(deviceId, now - (this.lastSeen.get(deviceId) ?? now));
    }
    this.lastSeen.set(deviceId, now);
  }

  check() {
    const now = this.now();
    for (const [deviceId, lastSeen] of this.lastSeen) {
      if (now - lastSeen > this.options.timeoutMs && !this.lost.has(deviceId)) {
        this.lost.add(deviceId);
        this.options.onLost(deviceId, lastSeen);
      }
    }
  }

  status(deviceId: string): { lastSeen: Date | null; online: boolean } {
    const lastSeen = this.lastSeen.get(deviceId);
    return {
      lastSeen: lastSeen === undefined ? null : new Date(lastSeen),
      online: lastSeen !== undefined && !this.lost.has(deviceId)
    };
  }

  start(intervalMs = 1000): () => void {
    const timer = setInterval(() => this.check(), intervalMs);
    return () => clearInterval(timer);
  }
}

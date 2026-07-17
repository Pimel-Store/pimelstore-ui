import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PullToRefreshService {
  refreshing = signal(false);
  private handler: (() => Promise<void>) | null = null;

  register(handler: () => Promise<void>) {
    this.handler = handler;
  }

  unregister(handler: () => Promise<void>) {
    if (this.handler === handler) this.handler = null;
  }

  async trigger() {
    if (!this.handler) return;
    this.refreshing.set(true);
    try {
      await this.handler();
    } finally {
      this.refreshing.set(false);
    }
  }
}

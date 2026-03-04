import { Injectable, signal } from '@angular/core';

declare global {
  interface Window { __deferredInstallPrompt: any; }
}

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferredPrompt: any = null;
  canInstall = signal(false);

  constructor() {
    // Pick up event captured before Angular bootstrapped
    if (window.__deferredInstallPrompt) {
      this.deferredPrompt = window.__deferredInstallPrompt;
      this.canInstall.set(true);
    }

    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      window.__deferredInstallPrompt = event;
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      window.__deferredInstallPrompt = null;
      this.canInstall.set(false);
    });
  }

  async install(): Promise<void> {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    window.__deferredInstallPrompt = null;
    this.canInstall.set(false);
  }
}

import { Injectable, signal } from '@angular/core';

export interface Alert {
  message: string;
  type: 'success' | 'error' | 'danger';
  duration?: number; // em ms
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  alert = signal<Alert | null>(null);

  show(message: string, type: 'success' | 'error' | 'danger' = 'success', duration = 5000) {
    this.alert.set({ message, type, duration });
    setTimeout(() => this.alert.set(null), duration);
  }

  hide() {
    this.alert.set(null);
  }
}

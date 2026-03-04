import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { AlertService } from './system-alert.service';

@Component({
  selector: 'app-system-alert',
  imports: [],
  templateUrl: './system-alert.component.html',
  styleUrls: ['./system-alert.component.scss'],
})
export class SystemAlertComponent {
  alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  private currentInterval: ReturnType<typeof setInterval> | null = null;

  progress = signal(100);

  constructor() {
    effect(() => {
      const alert = this.alertService.alert();
      if (alert) {
        if (this.currentInterval) {
          clearInterval(this.currentInterval);
        }
        this.progress.set(100);
        this.currentInterval = setInterval(() => {
          this.progress.update(value => value - 1);
          if (this.progress() <= 0) {
            clearInterval(this.currentInterval!);
            this.currentInterval = null;
          }
        }, (alert.duration || 5000) / 100);
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.currentInterval) {
        clearInterval(this.currentInterval);
      }
    });
  }

  alertIcon(): string {
    const type = this.alertService.alert()?.type;
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'danger': return 'warning';
      default: return 'info';
    }
  }

  onCloseClick() {
    this.alertService.hide();
  }
}

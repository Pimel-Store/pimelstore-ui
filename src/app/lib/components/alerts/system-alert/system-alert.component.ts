import { CommonModule } from '@angular/common';
import { Component, Input, signal, effect, inject } from '@angular/core';
import { AlertService } from './system-alert.service';

@Component({
  selector: 'C-system-alert',
  imports: [
    CommonModule
  ],
  templateUrl: './system-alert.component.html',
  styleUrls: ['./system-alert.component.scss'],
})

export class SystemAlertComponent {
  alertService = inject(AlertService);
  progress = signal(100);

  constructor() {
    effect(() => {
      const alert = this.alertService.alert();
      if (alert) {
        this.progress.set(100);
        const interval = setInterval(() => {
          this.progress.update(value => value - 1);
          if (this.progress() <= 0) {
            clearInterval(interval);
          }
        }, (alert.duration || 5000) / 100);
      }
    });
  }

  onCloseClick() {
    this.alertService.hide();
  }
}

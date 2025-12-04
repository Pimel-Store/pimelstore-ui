import { CommonModule } from '@angular/common';
import { Component, Input, signal, effect, inject } from '@angular/core';
import { LoadService } from './system-load.service';

@Component({
  selector: 'C-system-load',
  imports: [
    CommonModule
  ],
  templateUrl: './system-load.component.html',
  styleUrls: ['./system-load.component.scss'],
})

export class SystemLoadComponent {
  loadService = inject(LoadService);

  constructor() {
    effect(() => {
      // this.loadService.show();
    });
  }

  hide() {
    this.loadService.hide();
  }

}

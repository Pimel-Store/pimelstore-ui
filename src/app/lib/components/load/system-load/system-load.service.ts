import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadService {
  load = signal<boolean>(false);

  show() {
    this.load.set(true);
  }

  hide() {
    this.load.set(false);
  }
}

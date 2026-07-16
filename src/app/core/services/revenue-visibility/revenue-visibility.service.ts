import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RevenueVisibilityService {
  private readonly key = 'revenue-hidden';

  hidden = signal(localStorage.getItem(this.key) === 'true');

  toggle() {
    const next = !this.hidden();
    this.hidden.set(next);
    localStorage.setItem(this.key, String(next));
  }
}

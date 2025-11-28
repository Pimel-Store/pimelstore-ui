import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private html = document.documentElement;

    constructor() {
      const saved = localStorage.getItem('theme') || 'light';
      this.html.setAttribute('data-theme', saved);
    }

   toggleTheme() {
      const current = this.html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    }

    isDarkMode(): boolean {
      return this.html.getAttribute('data-theme') === 'dark';
    }


}

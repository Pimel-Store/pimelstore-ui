import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private html = document.documentElement;
    baseUrl: string;
    themeKey = 'theme-preference';

    constructor() {
      this.baseUrl = window.location.origin;
      const key = this.mountKey();

      const saved = localStorage.getItem(key) || 'light';
      this.html.setAttribute('data-theme', saved);
    }

   toggleTheme() {
      const current = this.html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.html.setAttribute('data-theme', next);
      this.storeThemePreference(next);
    }

    isDarkMode(): boolean {
      return this.html.getAttribute('data-theme') === 'dark';
    }

    storeThemePreference(theme: string) {
      const key = this.mountKey();
      localStorage.setItem(key, theme);
    }

    mountKey(){
      const base = this.baseUrl;
      const key = this.themeKey;
      return `${base}:${key}`;
    }


}

import { Component, signal } from '@angular/core';
import { ThemeService } from '../../../services/theme-service/theme-service.service';
import { ToggleComponent } from '../../../../lib/components/buttons/toggle/toggle.component';

@Component({
  selector: 'app-header',
  imports: [
    ToggleComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isDarkModeActive = signal<boolean>(true);
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isDarkModeActive.set(this.isDarkMode());
  }

  toggleTheme() {
      this.themeService.toggleTheme();
      this.isDarkModeActive.set(this.themeService.isDarkMode());
  }

  isDarkMode(): boolean {
      return this.themeService.isDarkMode();
  }

}

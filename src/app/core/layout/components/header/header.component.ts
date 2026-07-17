import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth-service/auth-service.service';
import { ThemeService } from '../../../services/theme-service/theme-service.service';
import { PwaInstallService } from '../../../services/pwa-install/pwa-install.service';
import { ToggleComponent } from '../../../../lib/components/buttons/toggle/toggle.component';
import { RevenueVisibilityService } from '../../../services/revenue-visibility/revenue-visibility.service';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-header',
  imports: [ToggleComponent, SettingsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  pwaInstall = inject(PwaInstallService);
  private revenueVisibility = inject(RevenueVisibilityService);

  isDarkModeActive = signal<boolean>(false);
  showInstallModal = signal(false);
  showSettingsModal = signal(false);
  revenueHidden = this.revenueVisibility.hidden;

  ngOnInit() {
    this.isDarkModeActive.set(this.themeService.isDarkMode());
  }

  onToggle(isActive: boolean) {
    this.themeService.toggleTheme();
    this.isDarkModeActive.set(this.themeService.isDarkMode());
  }

  toggleRevenueVisibility() {
    this.revenueVisibility.toggle();
  }

  handleInstallClick() {
    if (this.pwaInstall.canInstall()) {
      this.pwaInstall.install();
    } else {
      this.showInstallModal.set(true);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth-service/auth-service.service';
import { ThemeService } from '../../../services/theme-service/theme-service.service';
import { PwaInstallService } from '../../../services/pwa-install/pwa-install.service';
import { ToggleComponent } from '../../../../lib/components/buttons/toggle/toggle.component';

@Component({
  selector: 'app-header',
  imports: [ToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  pwaInstall = inject(PwaInstallService);

  isDarkModeActive = signal<boolean>(false);
  showInstallModal = signal(false);

  ngOnInit() {
    this.isDarkModeActive.set(this.themeService.isDarkMode());
  }

  onToggle(isActive: boolean) {
    this.themeService.toggleTheme();
    this.isDarkModeActive.set(this.themeService.isDarkMode());
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

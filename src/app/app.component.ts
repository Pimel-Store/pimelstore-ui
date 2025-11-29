import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme-service/theme-service.service';
import { SystemAlertComponent } from './lib/components/alerts/system-alert/system-alert.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SystemAlertComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Pimelstore UI';

  constructor(private themeService: ThemeService) {}

  toggleViewMode() {
    this.themeService.toggleTheme();
  }
}

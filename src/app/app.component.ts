import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme-service/theme-service.service';
import { SystemAlertComponent } from './lib/components/alerts/system-alert/system-alert.component';
import { SystemLoadComponent } from './lib/components/load/system-load/system-load.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SystemAlertComponent,
    SystemLoadComponent
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

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme-service/theme-service.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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

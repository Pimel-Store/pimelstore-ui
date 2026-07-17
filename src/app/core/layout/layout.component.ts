import { Component } from '@angular/core';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { RouterModule } from '@angular/router';
import { PullToRefreshDirective } from '../../lib/components/directives/pull-to-refresh/pull-to-refresh.directive';

@Component({
  selector: 'app-layout',
  imports: [
    AsideComponent,
    HeaderComponent,
    BottomNavComponent,
    RouterModule,
    PullToRefreshDirective
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {}

import { Component } from '@angular/core';
import { MenuItem } from './aside-menu.interfaces';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss']
})
export class AsideMenuComponent {

  currentRoute = '';

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: 'home', icon: 'home' },
    { label: 'Vendas', route: 'sales', icon: 'shopping_cart' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }
}

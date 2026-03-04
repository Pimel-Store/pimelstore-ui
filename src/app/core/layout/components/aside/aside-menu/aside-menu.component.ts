import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from './aside-menu.interfaces';

@Component({
  selector: 'app-aside-menu',
  imports: [RouterModule],
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss']
})
export class AsideMenuComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentRoute = '';

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: 'home', icon: 'home' },
    { label: 'Vendas', route: 'sales', icon: 'shopping_cart' }
  ];

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }
}

import { Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterModule],
  templateUrl: './bottom-nav.component.html'
})
export class BottomNavComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentRoute = '';

  menuItems = [
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

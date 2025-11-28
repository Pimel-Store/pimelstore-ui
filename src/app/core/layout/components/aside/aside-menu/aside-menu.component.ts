import { Component } from '@angular/core';
import { MenuItem } from './aside-menu.interfaces';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-menu',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss']
})
export class AsideMenuComponent {

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: 'home', icon: 'home' },
    { label: 'Sales', route: 'sales', icon: 'shopping_cart' }
  ];

  ngOnInit(): void {

  }

}

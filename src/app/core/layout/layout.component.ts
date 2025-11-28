import { Component } from '@angular/core';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-layout',
  imports: [
    AsideComponent,
    HeaderComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}

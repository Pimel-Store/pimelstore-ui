import { Component, ElementRef, ViewChild } from '@angular/core';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    AsideComponent,
    HeaderComponent,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
   @ViewChild(HeaderComponent, { read: ElementRef }) headerEl!: ElementRef;
   headerHeight = 0;

  ngAfterViewInit() {
    this.headerHeight = this.headerEl.nativeElement.offsetHeight;
  }

}

import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-no-auth',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './layout-no-auth.component.html',
  styleUrls: ['./layout-no-auth.component.scss']
})
export class LayoutNoAuthComponent {


}

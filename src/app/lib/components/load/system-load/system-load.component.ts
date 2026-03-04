import { Component, inject } from '@angular/core';
import { LoadService } from './system-load.service';

@Component({
  selector: 'app-system-load',
  imports: [],
  templateUrl: './system-load.component.html',
  styleUrls: ['./system-load.component.scss'],
})
export class SystemLoadComponent {
  loadService = inject(LoadService);
}

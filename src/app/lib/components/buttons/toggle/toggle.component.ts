import { Component, Input, Output, EventEmitter, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {
  @Input() isActive!: Signal<boolean>;

  @Output() valueChange = new EventEmitter<boolean>();

  onToggle(event: Event) {
    this.valueChange.emit((event.target as HTMLInputElement).checked);
  }
}

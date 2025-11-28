import { Component, Input, effect, Signal, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'C-toggle',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {
  // Recebe o valor externo
  @Input() isActive!: Signal<boolean>;
  @Input() onClick?: () => void;

  constructor() {
    effect(() => {

    });
  }

  onToggle() {
    if (this.onClick) {
      this.onClick();
    }
  }

}

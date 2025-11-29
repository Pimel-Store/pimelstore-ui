import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'C-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  valueChange = new EventEmitter<string>();
  constructor() {}

  onClick(event: any) {
    this.valueChange.emit('clicked');
  }

}

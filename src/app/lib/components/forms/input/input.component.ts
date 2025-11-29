import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'C-input-text',
  imports: [],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputTextComponent {
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: string | 'text' | 'password' | 'email' = 'text';

  @Output() valueChange = new EventEmitter<string>();

  constructor() {}

  onValueChange(event: any) {
    const newValue = event.target.value;
    this.valueChange.emit(newValue);
  }

}

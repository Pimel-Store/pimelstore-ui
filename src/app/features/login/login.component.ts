import { Component } from '@angular/core';
import { InputTextComponent } from '../../lib/components/forms/input/input.component';
import { ButtonComponent } from '../../lib/components/buttons/button/buttom.component';

@Component({
  selector: 'app-login',
  imports: [
    InputTextComponent,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  onEmailChange(value: string) {
    this.email = value;
  }

  onPasswordChange(value: string) {
    this.password = value;
  }

  onSubmitClick(value: any) {
    console.log('Login submitted with', this.email, this.password);
  }

}

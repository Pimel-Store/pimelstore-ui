import { Component } from '@angular/core';
import { InputTextComponent } from '../../lib/components/forms/input/input.component';
import { ButtonComponent } from '../../lib/components/buttons/button/buttom.component';
import { AuthService } from '../../core/auth/auth-service/auth-service.service';
import { User } from '../../core/interfaces/user';
import { Router } from '@angular/router';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onEmailChange(value: string) {
    this.email = value;
  }

  onPasswordChange(value: string) {
    this.password = value;
  }

  async onSubmitClick(value: any) {
    const data: User = {
      email: this.email,
      password: this.password
    };
    try {
      const response = await this.authService.login(data);
      if(response.data){
        this.router.navigate(['/home']);
      }
    } catch (error:any) {
        const message = error.error?.message || 'An error occurred during login.';
        alert(message);
    }

  }

}

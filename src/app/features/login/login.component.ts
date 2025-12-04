import { Component, inject, OnInit } from '@angular/core';
import { InputTextComponent } from '../../lib/components/forms/input/input.component';
import { ButtonComponent } from '../../lib/components/buttons/button/buttom.component';
import { AuthService } from '../../core/auth/auth-service/auth-service.service';
import { User } from '../../core/interfaces/user';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { passwordValidator } from '../../lib/validators/password.validator';
import { FloatingTooltipDirective } from '../../lib/components/directives/floating-tooltip/floating-tooltip.directive';
import { AlertService } from '../../lib/components/alerts/system-alert/system-alert.service';
import { LoadService } from '../../lib/components/load/system-load/system-load.service';

@Component({
  selector: 'app-login',
  imports: [
    InputTextComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    FloatingTooltipDirective
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  alertService = inject(AlertService);
  loadService = inject(LoadService);
  _form!: FormGroup;

  // Getter conveniente
  get fc(): Record<string, AbstractControl> {
    return this._form.controls;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
     this._form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]]
    });
  }

  async ngOnInit(): Promise<void> {
    if (await this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  async onSubmitClick() {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }
    this.loadService.show();
    const data: User = this._form.value;

    try {
      const response = await this.authService.login(data);
      if (response.data) {
        this.alertService.show('Login successful!', 'success');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      const message = error.error?.message || 'An error occurred during login.';
      this.alertService.show(message, 'error');
    } finally {
      this.loadService.hide();
    }
  }

  getTooltipText(): string {
    return 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.';
  }
}

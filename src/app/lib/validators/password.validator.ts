import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;

    if (!password) return null;

    if (password.length < 8) {
      return { passwordError: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { passwordError: 'Password must contain at least one uppercase letter.' };
    }
    if (!/[a-z]/.test(password)) {
      return { passwordError: 'Password must contain at least one lowercase letter.' };
    }
    if (!/[0-9]/.test(password)) {
      return { passwordError: 'Password must contain at least one digit.' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { passwordError: 'Password must contain at least one special character.' };
    }

    return null; // válido
  };
}

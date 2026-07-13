import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
      // TODO check that is is not used
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    passwordConfirmation: new FormControl('')
  }, { validators: (control) => control.get('password').value === control.get('passwordConfirmation').value ? null : { passwordDoNotMatch: true } })

  onSubmit() {
    this.signupForm.markAllAsTouched(); // Marks all controls as touched to trigger validation
    if (this.signupForm.invalid) {
      return;
    }

  }
}

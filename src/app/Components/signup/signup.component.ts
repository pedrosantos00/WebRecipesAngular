import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  type: string = "password"
  istText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  signupForm!: FormGroup;
  companyName?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alert: NgToastService

  ) {

  }
  ngOnInit(): void {
      // Init the signup form
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  // Toggle password visibility
  hideShowPass() {
    this.istText = !this.istText;
    this.istText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.istText ? this.type = "text" : this.type = "password";

  }

  // If the form is valid, sign up the user
  onRegister() {
    if (this.signupForm.valid) {
      this.auth.signUp(this.signupForm.value)
        .subscribe({
          next: (res) => {
            this.router.navigate(['login']);
            this.alert.success({ detail: "SUCCESS", summary: res?.message, duration: 5000 })
          },
          error: (err) => {
            this.alert.error({ detail: "ERROR", summary: err?.message, duration: 5000 });
          }
        })
    }
    else {
      this.validateAllFormFields(this.signupForm);
      this.alert.error({ detail: "ERROR", summary: "Fill all the required data", duration: 5000 });
    }

  }

  // mark form controls as dirty
  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(f => {
      const control = formGroup.get(f);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      }
      else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    })
  }
}

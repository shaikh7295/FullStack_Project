import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginForm: boolean = true
  LoginUser: string = ''
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private route: Router, private authService: AuthService, private userDetailsService: UserDetailsService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      dob: new FormControl('', [Validators.required, this.minimumAgeValidator(18)]),
      image: new FormControl('', [Validators.required])
    });
  }

  onRegister() {
    console.log(this.registerForm.value,)
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('firstName', this.registerForm.value.firstName);
      formData.append('lastName', this.registerForm.value.lastName);
      formData.append('email', this.registerForm.value.email);
      formData.append('password', this.registerForm.value.password);
      formData.append('mobileNumber', this.registerForm.value.mobileNumber);
      formData.append('dob', this.registerForm.value.dob);
      formData.append('image', this.registerForm.value.image);

      this.authService.registerUser(formData).subscribe({
        next: res => {
          alert(res.message);

          this.toggleForm();
        },
        error: (err) => {
          alert(err.error?.error || 'Registration failed')
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      return
    }

  }


  onSubmit() {
    if (this.isLoginForm) {
      console.log(this.loginForm.value);
      if (this.loginForm.valid) {
        this.LoginUser = this.loginForm.value.email;

        this.authService.loginUser(this.loginForm.value).subscribe({
          next: res => {
            alert(res.message);
            this.userDetailsService.setUser(res.user);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.route.navigate(['dashboard']);
          },
          error: (err) => {
            alert(err.error?.error || 'Registration failed')
          }
        });
      } else {
        console.log('Login Form is invalid');
        this.loginForm.markAllAsTouched();
      }
    } else {
      if (this.registerForm.valid) {
        console.log('Register Form Submitted', this.registerForm.value);
      } else {
        console.log('Register Form is invalid');
      }
    }
  }


  toggleForm() {
    this.isLoginForm = !this.isLoginForm;
  }



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.registerForm.patchValue({ image: file });
    } else {
      this.imagePreview = null;
    }
  }



  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const dobValue = control.value;
      if (!dobValue) return null;

      const today = new Date();
      const dob = new Date(dobValue);

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup; 
  serverErrorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]], 
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      this.loading = true; 
      const { username, email, password } = this.registerForm.value;
  
      this.authService.register(username, email, password).subscribe(
        () => {
          this.serverErrorMessage = null; 
          this.loading = false;
          this.router.navigate(['/search']); 
        },
        (error) => {
          if (error.message) {
            this.loading = false;
            this.serverErrorMessage = error.message; 
          } else {
            this.serverErrorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
      );
    } else {
      Object.values(this.registerForm.controls).forEach((control) => control.markAsTouched());
    }
  }  
}

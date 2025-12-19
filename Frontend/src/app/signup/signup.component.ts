
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {

  constructor(private router: Router, private http: HttpClient) {}

  isSignUpTab: boolean = true;
  userType: string = 'student';
  showPassword: boolean = false;

  student = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  alumni = {
    firstName: '',
    lastName: '',
    graduationYear: null as number | null,
    email: '',
    cin: '',
    department: '',
    password: ''
  };
  

  selectUserType(type: string): void {
    this.userType = type;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  
    if (this.userType === 'student') {
      if (this.isStudentFormValid()) {
        this.http.post('/api/student/signup', this.student).subscribe({
          next: (response) => {
            console.log('Signup successful', response);
            this.router.navigate(['/profile'], {
              state: { user: this.student, userType: this.userType }
            });
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Signup failed';
            alert('Signup failed: ' + errorMessage);
            console.error('Signup error:', error);
          }
        });
      } else {
        alert('Please fill all student fields!');
      }
    } else {
      if (this.isAlumniFormValid()) {
        this.http.post('/api/alumni/signup', this.alumni).subscribe({
          next: (response) => {
            console.log('Signup successful', response);
            this.router.navigate(['/verification-pending'], {
              state: { user: this.alumni, userType: this.userType }
            });
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Signup failed';
            alert('Signup failed: ' + errorMessage);
            console.error('Signup error:', error);
          }
        });
      } else {
        alert('Please fill all alumni fields!');
      }
    }
  }

  private isStudentFormValid(): boolean {
    return (
      this.student.firstName?.trim().length > 0 &&
      this.student.lastName?.trim().length > 0 &&
      this.student.email?.trim().length > 0 &&
      this.student.password?.trim().length >= 8
    );
  }

  private isAlumniFormValid(): boolean {
    return (
      this.alumni.firstName?.trim().length > 0 &&
      this.alumni.lastName?.trim().length > 0 &&
      this.alumni.graduationYear !== null &&
      this.alumni.email?.trim().length > 0 &&
      this.alumni.cin?.trim().length > 0 &&
      this.alumni.department?.trim().length > 0 &&
      this.alumni.password?.trim().length >= 8
    );
  }
}

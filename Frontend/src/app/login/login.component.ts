
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login = {
    email: '',
    password: ''
  };
  constructor(private http: HttpClient, private router: Router, private authService : AuthService) {}
  onLogin(): void {
    const loginData = this.login;
  
    // First get user type with proper type handling
    this.http.get<string>(`/api/auth/user-type?email=${loginData.email}`, { 
      responseType: 'text' as 'json' 
    }).subscribe({
      next: (userType: string) => {
        let endpoint = '';
        let route = '';
  
        if (userType === 'alumni') {
          endpoint = '/api/alumni/login';
          route = '/profile-alumni';
        } else if (userType === 'student') {
          endpoint = '/api/student/login';
          route = '/profile';
        } else {
          alert('Unknown user type');
          return;
        }
  
        // Then make login request
        this.http.post<any>(endpoint, loginData).subscribe({
          next: (response: any) => {
            console.log('Login successful:', response);
            this.authService.setUser(response);
            this.authService.setUserType(userType);
            this.router.navigate([route]);
          },
          error: (error) => {
            console.error('Login error:', error);
            alert('Login failed: ' + error.error?.message || error.message);
          }
        });
      },
      error: (error) => {
        console.error('User type fetch error:', error);
        alert('No account found with this email.');
      }
    });
  }
}

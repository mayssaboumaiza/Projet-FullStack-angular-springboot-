import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  constructor(private router: Router) {}
  // Navigation to Sign Up page
  navigateToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }

  // Navigation to Log In page
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }


  // Navigation vers Join Us
  navigateToJoinUs() {
    this.router.navigate(['/join-us']);
  }

  // Navigation vers Terms
  navigateToTerms() {
    this.router.navigate(['/terms']);
  }
}
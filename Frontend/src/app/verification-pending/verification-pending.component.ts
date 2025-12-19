import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-pending',
  templateUrl: './verification-pending.component.html',
  styleUrls: ['./verification-pending.component.css']
})
export class VerificationPendingComponent {

  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/']); // Redirige vers la page d'accueil
  }
}
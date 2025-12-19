import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private currentUserSubject = new BehaviorSubject<any>(null);
  private userTypeSubject = new BehaviorSubject<string>('');

  currentUser$ = this.currentUserSubject.asObservable();
  userType$ = this.userTypeSubject.asObservable();

  getUser(): any {
    return this.currentUserSubject.value;
  }

  getUserType(): string {
    return this.userTypeSubject.value;
  }
  private getStoredUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  private getStoredUserType(): string {
    return localStorage.getItem('userType') || '';
  }

  setUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  setUserType(userType: string): void {
    localStorage.setItem('userType', userType);
    this.userTypeSubject.next(userType);
  }

  clearAuth(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
    this.userTypeSubject.next('');
  }
}

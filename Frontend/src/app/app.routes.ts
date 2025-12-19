import { Routes } from '@angular/router';
import { TermsComponent } from './terms/terms.component';
import { HomepageComponent } from './homepage/homepage.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { SignUpComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { VerificationPendingComponent } from './verification-pending/verification-pending.component';
import { ProfileAlumniComponent } from './profile-alumni/profile-alumni.component';
export const routes: Routes = [  { path: '', component: HomepageComponent },
    { path: 'terms', component: TermsComponent },
    { path: 'join-us', component: JoinUsComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'verification-pending', component: VerificationPendingComponent },
    { path: 'profile-alumni', component: ProfileAlumniComponent },];
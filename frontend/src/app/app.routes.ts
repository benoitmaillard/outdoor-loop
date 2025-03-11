import { Routes } from '@angular/router';
import { RoutePlannerComponent } from './route-planner/route-planner.component';
import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/signup.component';

export const routes: Routes = [
  { path: 'route-planner', component: RoutePlannerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', redirectTo: '/route-planner', pathMatch: 'full' }
];

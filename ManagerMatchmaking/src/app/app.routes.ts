// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from '../componenet/login/login.component';
import { authGuard } from './guard/auth.guard';
import { AnalyticsComponent } from '../componenet/analytics/analytics.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'analytics', 
    component: AnalyticsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'matchmakers', 
    loadComponent: () => import('../componenet/matchmakers/matchmakers.component').then(m => m.MatchmakersComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
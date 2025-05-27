// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { authGuard } from './guard/auth.guard';
import { AnalyticsComponent } from '../component/analytics/analytics.component';

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
    loadComponent: () => import('../component/matchmakers/matchmakers.component').then(m => m.MatchmakersComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
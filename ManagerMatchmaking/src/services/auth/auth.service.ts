// src/app/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  username: string;
  role: string;
  // Add any other user properties from your token
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7012/api/Admin';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    // Check if we have a token on service initialization
    this.loadUserFromToken();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.storeToken(response.token);
            this.loadUserFromToken();
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<any>(token);
        
        // Create user object from token claims
        const user: User = {
          id: decodedToken.sub || decodedToken.id,
          username: decodedToken.username || decodedToken.name,
          role: decodedToken.role || 'user',
          // Map any other properties from token
        };
        
        // Store the user data for easy access
        this.currentUser = user;
        localStorage.setItem('user_data', JSON.stringify(user));
        
      } catch (error) {
        console.error('Failed to decode token', error);
        this.logout(); // Invalid token, clear it
      }
    }
  }
}
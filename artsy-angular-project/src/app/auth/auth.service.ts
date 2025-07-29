import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface AuthResponse {
  message: string;
  username?: string;
  userId?: string;
  email?: string;
  avatarUrl?: string;
}

interface UserData {
  userId: string;
  username: string;
  email: string;
  avatarUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  //private baseUrl = 'http://localhost:3000/auth';
  private baseUrl = 'https://artsy2bypunith-429730.wl.r.appspot.com/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  initializeAuthState(): Observable<void> {
    this.isLoadingSubject.next(true);
    return this.getCurrentUser().pipe(
      tap({
        next: (userData) => {
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(userData);
        },
        error: () => {
          this.isLoggedInSubject.next(false);
          this.currentUserSubject.next(null);
        },
        finalize: () => { this.isLoadingSubject.next(false); }
      }),
      map(() => void 0) // Convert to Observable<void>
    );
  }
  


  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/register`,
      { username, email, password },
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        this.currentUserSubject.next({
          userId: response.userId || '',
          username: response.username || '',
          email: response.email || '',
          avatarUrl: response.avatarUrl || ''
        });
        this.isLoggedInSubject.next(true);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error.message || 'Registration failed'));
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        this.currentUserSubject.next({
          userId: response.userId || '',
          username: response.username || '',
          email: response.email || '',
          avatarUrl: response.avatarUrl || ''
        });
        this.isLoggedInSubject.next(true);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error.message || 'Login failed'));
      })
    );
  }

  // auth.service.ts
  getCurrentUser(): Observable<UserData> {
    return this.http.get<any>(`${this.baseUrl}/me`, { withCredentials: true }).pipe(
      map((response) => {
        // Handle nested response structure
        if (response.success && response.user) {
          return {
            userId: response.user.userId,
            username: response.user.username,
            email: response.user.email,
            avatarUrl: response.user.avatarUrl
          };
        }
        // Fall back to direct properties if not nested
        return response as UserData;
      }),
      tap((userData) => {
        this.currentUserSubject.next(userData);
        this.isLoggedInSubject.next(true);
      }),
      catchError((error) => {
        console.error('Error fetching current user:', error);
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
        return throwError(() => error);
      })
    );
  }
  


  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
      })
    );
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/delete-account`,
      { withCredentials: true } // Cookies are sent automatically
    ).pipe(
      tap(() => {
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
      }),
      catchError((error) => {
        console.error('Delete account error:', error);
        return throwError(() => new Error('Failed to delete account. Please try again.'));
      })
    );
  }

  // Add to AuthService class
  get currentUserValue(): UserData | null {
    return this.currentUserSubject.value;
  }
}

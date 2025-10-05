// filepath: /Users/mihai/Desktop/ProiectMF/AplicatiaMF/FrontEnd/src/app/services/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  // Shape unknown; include common fields optionally
  token?: string;
  // Often APIs return user object or fields alongside token
  user?: Partial<User>;
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string; // derived full name if provided
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5146/api/users';

  // Signal-based user state, hydrated from localStorage
  private readonly _user = signal<User | null>(readUserFromStorage());
  readonly user = this._user.asReadonly();
  readonly isAuthenticatedSig = computed(() => !!this._user() || !!this.token);

  constructor() {
    // If we have a token but no user (e.g., after refresh), try to derive from token
    if (!this._user() && this.token) {
      const derived = deriveUserFromToken(this.token);
      if (derived) {
        this.setUser(derived);
      }
    }
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}`, payload);
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        if (res && res.token) {
          localStorage.setItem(TOKEN_KEY, res.token);
        }
        // Try to set user from response; if not enough info, fall back to token
        const fromRes: User | null = extractUserFromResponse(res);
        const fromToken: User | null = this.token ? deriveUserFromToken(this.token) : null;
        const user: User | null = fromRes || fromToken;
        if (user) {
          this.setUser(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this._user() || !!this.token;
  }

  private setUser(user: User) {
    // Compute a display name if possible
    const name = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    const normalized: User = {
      ...user,
      name: name || user.email || undefined,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    this._user.set(normalized);
  }
}

function readUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function extractUserFromResponse(res: AuthResponse | null | undefined): User | null {
  if (!res) return null;
  if (res.user) {
    const u = res.user;
    return {
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      name: (u as any).name,
    };
  }
  if (res.firstName || res.lastName || res.email || res.name) {
    return {
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
      name: res.name,
    };
  }
  return null;
}

function deriveUserFromToken(token: string | null): User | null {
  if (!token) return null;
  try {
    const payload = decodeJwt(token);
    if (!payload || typeof payload !== 'object') return null;
    const firstName = (payload as any)['given_name'] || (payload as any)['firstName'];
    const lastName = (payload as any)['family_name'] || (payload as any)['lastName'];
    const name = (payload as any)['name'] || [firstName, lastName].filter(Boolean).join(' ').trim();
    const email = (payload as any)['email'] || (payload as any)['unique_name'] || undefined;
    if (name || email) {
      return { firstName, lastName, email, name };
    }
    return null;
  } catch {
    return null;
  }
}

function decodeJwt(token: string): unknown {
  // Basic, non-validating JWT payload decode
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}

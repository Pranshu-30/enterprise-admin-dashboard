import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import type { User, UserRole, LoginRequest, LoginResponse } from '../models';

const TOKEN_KEY = 'enterprise_admin_token';
const USER_KEY = 'enterprise_admin_user';
const ROLE_KEY = 'enterprise_admin_role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(this.getStoredUser());
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly roleSignal = signal<UserRole | null>(this.getStoredRole());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly currentRole = this.roleSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.get<MockUser[]>('assets/mock-users.json').pipe(
      map((users) => {
        const found = users.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.toLowerCase() &&
            u.password === credentials.password
        );

        if (!found) {
          throw new Error('Invalid email or password');
        }
        const role = found.role as UserRole;
        const user: User = {
          id: found.id,
          name: found.name,
          username: found.username,
          email: found.email,
          role,
          isActive: true,
        };
        const token = `mock-token-${user.id}`;
        return { token, user, role };
      }),
      tap((res) => {
        this.setSession(res.token, res.user, res.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.roleSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasRole(role: UserRole): boolean {
    return this.roleSignal() === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const current = this.roleSignal();
    return current !== null && roles.includes(current);
  }

  private setSession(token: string, user: User, role: UserRole): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROLE_KEY, role);
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);
    this.roleSignal.set(role);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private getStoredRole(): UserRole | null {
    const r = localStorage.getItem(ROLE_KEY);
    return (r as UserRole) || null;
  }
}
interface MockUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

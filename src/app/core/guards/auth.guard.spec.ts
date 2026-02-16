import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: false,
    });
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should allow access when authenticated', () => {
    Object.defineProperty(authService, 'isAuthenticated', {
      get: () => true,
      configurable: true,
    });
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    const urlTree = {} as ReturnType<Router['createUrlTree']>;
    router.createUrlTree.and.returnValue(urlTree);
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(result).toBe(urlTree);
  });
});

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['hasAnyRole']);
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    route = { data: { roles: ['Admin'] } } as ActivatedRouteSnapshot;
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should allow access when user has role', () => {
    authService.hasAnyRole.and.returnValue(true);
    const state = {} as import('@angular/router').RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      roleGuard(route, state),
    );
    expect(result).toBe(true);
    expect(authService.hasAnyRole).toHaveBeenCalledWith(['Admin']);
  });

  it('should redirect to dashboard when user lacks role', () => {
    authService.hasAnyRole.and.returnValue(false);
    const urlTree = {} as ReturnType<Router['createUrlTree']>;
    router.createUrlTree.and.returnValue(urlTree);
    const state = {} as import('@angular/router').RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      roleGuard(route, state),
    );
    expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBe(urlTree);
  });
});

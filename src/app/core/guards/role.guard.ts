import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import type { UserRole } from '../models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data['roles'] as UserRole[]) ?? [];

  if (allowedRoles.length === 0) {
    return true;
  }
  if (auth.hasAnyRole(allowedRoles)) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};

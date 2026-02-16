import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import type { UserRole } from '../../core/models';

/**
 * Structural directive *appHasRole="['Admin','Manager']". Shows template only if current user has one of the roles.
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly auth = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  private allowedRoles: UserRole[] = [];
  private hasView = false;

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    effect(() => {
      this.auth.currentRole();
      this.updateView();
    });
  }

  private updateView(): void {
    const show = this.auth.hasAnyRole(this.allowedRoles);
    if (show && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!show && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { SettingsService } from '../core/services/settings.service';
import { HasRoleDirective } from '../shared/directives/has-role.directive';
import type { UserRole } from '../core/models';

interface NavItem {
  label: string;
  route: string;
  roles?: UserRole[];
  icon?: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  readonly currentUser = this.auth.currentUser;
  readonly theme = this.settings.theme;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Users', route: '/users', roles: ['Admin', 'Manager'], icon: 'people' },
    { label: 'Products', route: '/products', icon: 'inventory' },
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];

  constructor(
    readonly auth: AuthService,
    readonly settings: SettingsService,
  ) {}

  logout(): void {
    this.auth.logout();
  }

  toggleTheme(): void {
    this.settings.toggleTheme();
  }

  canSee(item: NavItem): boolean {
    if (!item.roles?.length) return true;
    return this.auth.hasAnyRole(item.roles);
  }
}

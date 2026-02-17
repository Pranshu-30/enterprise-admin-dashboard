import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import type { UserRole } from '../core/models';

interface NavItem {
  label: string;
  route: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {

  currentUser = this.auth.currentUser;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Users', route: '/users', roles: ['Admin', 'Manager'] },
    { label: 'Products', route: '/products' },
  ];
  constructor(private auth: AuthService) {}
  logout(): void {
    this.auth.logout();
  }

  canSee(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return this.auth.hasAnyRole(item.roles);
  }
}
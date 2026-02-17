import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import type { User } from '../../core/models';
import { GridModule, PageService, SortService, FilterService, ToolbarService, SearchService } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    GridModule,
  ],
  providers: [PageService, SortService, FilterService, ToolbarService, SearchService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {

    searchControl = new FormControl('', { nonNullable: true });
    users = signal<User[]>([]);
    loading = signal(false);
    currentRole = this.auth.currentRole;

  pageSettings = { pageSize: 10, pageSizes: [5, 10, 20, 50] };
  filterSettings = { type: 'Excel' };
  toolbar: string[] = ['Search'];

  private searchSubject = new Subject<string>();
  private allUsers: User[] = [];

  constructor(
    private userService: UserService,
    readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((query) => this.applySearch(query));

    this.searchControl.valueChanges.pipe(startWith('')).subscribe((v) => this.searchSubject.next(v));
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (list) => {
        this.allUsers = list;
        this.applySearch(this.searchControl.value);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private applySearch(query: string): void {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.users.set(this.allUsers);
      return;
    }
    const filtered = this.allUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q),
    );
    this.users.set(filtered);
  }

  trackByUser(_index: number, user: User): number {
    return user.id;
  }

  canEdit(): boolean {
    return this.auth.hasAnyRole(['Admin', 'Manager']);
  }

  canDelete(): boolean {
    return this.auth.hasRole('Admin');
  }
}

import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import type { UserCreateDto, UserRole } from '../../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  isEdit = false;
  userId: number | null = null;
  loading = false;
  errorMessage = '';

  readonly roles: UserRole[] = ['Admin', 'Manager', 'Viewer'];

  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    this.userId = id ? +id : null;
    this.buildForm();
    if (this.isEdit && this.userId) {
      this.loadUser(this.userId);
    }
  }

  private buildForm(): void {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      role: ['Viewer' as UserRole],
      isActive: [true],
      phones: this.fb.array([this.fb.control('')]),
    });
  }

  private loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          name: user.name,
          username: user.username,
          email: user.email,
          website: user.website ?? '',
          isActive: user.isActive ?? true,
        });
        if (user.phone) {
          this.phones.clear();
          this.phones.push(this.fb.control(user.phone));
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  addPhone(): void {
    this.phones.push(this.fb.control(''));
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.loading = true;
    const value = this.form.getRawValue();
    const dto: UserCreateDto = {
      name: value.name,
      username: value.username,
      email: value.email,
      website: value.website || undefined,
      role: value.role,
      isActive: value.isActive,
    };

    const req = this.isEdit && this.userId
      ? this.userService.updateUser(this.userId, dto)
      : this.userService.createUser(dto);

    req.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.message ?? 'Operation failed';
      },
    });
  }
}

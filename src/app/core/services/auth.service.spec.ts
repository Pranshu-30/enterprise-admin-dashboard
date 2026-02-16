import { TestBed } from '@angular/core/testing';
import {  HttpClientTestingModule,HttpTestingController} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;
  const mockUsers = [
    {
      id: 1,
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'Admin',
    },
    {
      id: 3,
      name: 'Viewer User',
      username: 'viewer',
      email: 'viewer@example.com',
      password: 'viewer123',
      role: 'Viewer',
    },
  ];

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated when no token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should login and set token for admin user', (done) => {
    service.login({ email: 'admin@example.com', password: 'admin123' }).subscribe({
      next: () => {
        expect(service.isAuthenticated()).toBe(true);
        expect(service.getToken()).toBeTruthy();
        expect(service.currentUser()).toBeTruthy();
        expect(service.currentRole()).toBe('Admin');
        done();
      },
    });

    const req = httpMock.expectOne('assets/mock-users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should login as Viewer user', (done) => {
    service
      .login({ email: 'viewer@example.com', password: 'viewer123' })
      .subscribe({
        next: () => {
          expect(service.currentRole()).toBe('Viewer');
          done();
        },
      });

    const req = httpMock.expectOne('assets/mock-users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should logout and clear state', (done) => {
    service.login({ email: 'admin@example.com', password: 'admin123' }).subscribe({
      next: () => {
        service.logout();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.getToken()).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      },
    });

    const req = httpMock.expectOne('assets/mock-users.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});

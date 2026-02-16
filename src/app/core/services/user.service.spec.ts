import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers should return users', () => {
    const mockUsers = [{ id: 1, name: 'Test', username: 'test', email: 'test@test.com' }];
    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
    const req = httpMock.expectOne(environment.apiUsers);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('getUserById should return one user', () => {
    const mockUser = { id: 1, name: 'Test', username: 'test', email: 'test@test.com' };
    service.getUserById(1).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(`${environment.apiUsers}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('createUser should POST and return user', () => {
    const dto = { name: 'New', username: 'new', email: 'new@test.com' };
    const mockUser = { id: 11, ...dto };
    service.createUser(dto).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne(environment.apiUsers);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
});

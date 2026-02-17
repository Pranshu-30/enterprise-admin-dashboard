import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { User, UserCreateDto } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.apiUsers;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  createUser(dto: UserCreateDto): Observable<User> {
    return this.http.post<User>(this.baseUrl, dto);
  }

  updateUser(id: number, dto: Partial<UserCreateDto>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, dto);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchUsers(query: string): Observable<User[]> {
    const params = query ? new HttpParams().set('q', query) : undefined;
    return this.http.get<User[]>(this.baseUrl, { params });
  }
}

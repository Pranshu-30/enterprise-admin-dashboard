/**
 * User entity and API response interfaces
 */
export type UserRole = 'Admin' | 'Manager' | 'Viewer';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: { name: string; catchPhrase?: string };
  address?: { street?: string; city?: string; zipcode?: string };
  role?: UserRole;
  isActive?: boolean;
}

export interface UserCreateDto {
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface AuthUser extends User {
  token: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  role: UserRole;
}

import { Injectable } from '@angular/core';
import { UserRole, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User = {
    id: 1,
    name: 'Responsable Technique',
    role: 'RT'
  };

  constructor() { }

  getCurrentUser(): User {
    return this.currentUser;
  }

  getCurrentUserRole(): UserRole {
    return this.currentUser.role;
  }

  setCurrentUserRole(role: UserRole): void {
    this.currentUser.role = role;
  }

  isRT(): boolean {
    return this.currentUser.role === 'RT';
  }

  isRC(): boolean {
    return this.currentUser.role === 'RC';
  }

  isCP(): boolean {
    return this.currentUser.role === 'CP';
  }
}

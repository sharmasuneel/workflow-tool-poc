import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any = null;
  private users: any[] = [];

  setUsers(users: any[]) {
    this.users = users;
  }

  getUsers() {
    return this.users;
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
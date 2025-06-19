import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private user: any = null;
  private users: any[] = [];
  private workflows: any[] = [];

  setUsers(users: any[]) {
    this.users = users;
  }

  getUsers() {
    return this.users;
  }

  setWorkflows(workflows: any[]) {
    this.workflows = workflows;
  }

  getWorkflows() {
    return this.workflows;
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
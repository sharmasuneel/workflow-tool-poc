import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private user: any = null;
  private users: any[] = [];
  private workflows: any[] = [];
  private payloadWorkFlow: any = null;

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

  setWorkFlowPayload(payloadWorkFlow: any) {
    this.payloadWorkFlow = payloadWorkFlow
  }

  getWorkFlowPayload() {
    return this.payloadWorkFlow
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
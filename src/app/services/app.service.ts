import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private user: any = null;
  private users: any[] = [];
  private workflows: any[] = [];
  private payloadWorkFlow: any = { metadata: {}, files: null };
  private workflowId: string;
  private workflowName: string;
  private filter: any;

  setFilter(filter: any) {
    this.filter = { ...this.filter, ...filter };
  }

  getFilter() {
    return this.filter;
  }

  setWorkflowName(name: string) {
    this.workflowName = name;
  }

  getWorkflowName(): string {
    return this.workflowName;
  }

  setWorkflowId(id: string) {
    this.workflowId = id;
  }

  getWorkflowId(): string {
    return this.workflowId;
  }

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
    return this.workflows
  }

  setWorkFlowPayload(type: string, taskType: string, action: string, data: any, files?: any) {
    let metadata = this.payloadWorkFlow.metadata
    metadata.workflowId = this.workflowId
    metadata.workflow = this.workflowName
    if (type === 'workflow') {
      metadata.progress = data.progress || 0
      metadata.commentary = data.commentary || ''
      metadata.status = data.status || ''
    }
    if (type === 'task' && taskType) {
      let tasks = metadata.tasks || []
      if (tasks.length === 0 && action !== 'delete') {
        tasks.push(data)
      } else if (action === 'delete' && tasks.length > 0) {
        tasks = metadata.tasks.filter((task: any) => task.taskType !== taskType)
      } else {
        tasks = metadata.tasks.map((task: any) => {
          return task.taskType === taskType ? { ...data } : task
        }
        )
      }
      metadata.tasks = tasks

    }
    this.payloadWorkFlow = { metadata, files: files || this.payloadWorkFlow.files }
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
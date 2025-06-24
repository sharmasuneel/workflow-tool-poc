import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

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
  private enabledNodes: any;
  private phase: string;
  private newWorkflow: any = {}

  setEnabledNodes(value: any) {
    this.enabledNodes = value;
  }

  initiateWorkFlow(data?: any, uiWorkflowId?: string) {
    const workflow = {
        uiWorkflowId: data?.uiWorkflowId || uuidv4(),
        workflowName: data.workflowName,
        progress: data.progress || 0,
        commentary: data?.commentary || '',
        status: data?.status || 'Not Started',
        createdBy: data?.createdBy || this.user?.userId,
        preparatorGroupId: data?.preparatorGroupId || null,
        reviewerGroupId: data?.reviewerGroupId || null,
        approverGroupId: data?.approverGroupId || null,
        tasks: data?.tasks || [],
      }

      this.newWorkflow = workflow

  }

  getEnabledNodes(role: string) {
    if (role === 'preparator') {
      return ['upload', 'download']
    } else if (role === 'reviewer') {
      return ['review']
    } else if (role === 'approver') {
      return ['decide', 'attestation']
    }
    return ['upload', 'download', 'review', 'decide', 'attestation', 'start']
  }

  setFilter(filter: any) {
    this.filter = { ...this.filter, ...filter };
  }

  getTaskById(id: string) {
    const workflow = this.workflows.filter((workflow: any ) => workflow.workflowId === this.workflowId)[0];
    if (workflow) {
      return workflow.tasks.find((task: any) => task.uiTaskId === id);
    }
    return null;
  }
  getFilter() {
    return this.filter;
  }

  setWorkflowName(name: string) {
    this.workflowName = name;
  }

  setPhase(name: string) {
    this.phase = name;
  }

  getPhase() {
    return this.phase;
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

  getWorkflowById(id: number) {
    return this.workflows.find(workflow => workflow.workflowId === id);
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
    metadata.workflowName = this.workflowName
    if (type === 'workflow') {
      metadata = {...metadata, ...data}
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
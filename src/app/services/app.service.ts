import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private user: any = { "userId": 1, "name": "Owner", "role": "owner" };
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
      workflowName: data?.workflowName,
      progress: data?.progress || 0,
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

  getNewWorkflow() {
    return this.newWorkflow;
  }

  setWorkflows(workflows: any[]) {
    let files: any[] = []
    workflows.forEach(workflow => {
      const uploadTask =  workflow.tasks.find((task: any) => task.taskType === 'upload');
      files = uploadTask?.files || [];
      if (workflow.drawflow) {
        workflow.drawflow = JSON.parse(workflow.drawflow);
      } else {
        workflow.drawflow = {}
      }
    });
    const newWorkflowWithFiles: any = workflows.map((workflow: any) => {
      workflow.tasks = workflow.tasks.map((task: any) => {
        return { ...task, files: files };
      });
      return workflow;
    });

    this.workflows = newWorkflowWithFiles;
  }

  getWorkflows() {
    return this.workflows
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
    const workflow = this.workflows.filter((workflow: any) => workflow.workflowId === this.workflowId)[0];
    if (workflow) {
      return workflow.tasks.find((task: any) => task.uiTaskId === id);
    }
    return null;
  }

  getFilter() {
    return this.filter;
  }
  updateTaskById(uiTaskId: string, data: any) {
    if(this.phase === 'creation') {
      const workflow = this.newWorkflow;
      if (data.taskType === 'upload') {
        workflow.approverGroupId = data.approver || null;
        workflow.preparatorGroupId = data.preparator || null;
        workflow.reviewerGroupId = data.reviewer || null;
        workflow.workflowName = this.workflowName || null;
        workflow.files = data.files || null;
        workflow.uploadType =  data.uploadType
        if (!workflow.tasks.some((task: any) => task.uiTaskId === data.uiTaskId)) {
          workflow.tasks = [...workflow.tasks, data];
        }
      } else {
        if (!workflow.tasks.some((task: any) => task.uiTaskId === data.uiTaskId)) {
          workflow.tasks = [...workflow.tasks, data];
        }
      }
      this.newWorkflow = workflow;
      return workflow;
    } else if (this.phase === 'execution') {
      const workflow = this.workflows.find((w: any) => w.workflowId === this.workflowId);
      if (workflow && Array.isArray(workflow.tasks)) {
        const idx = workflow.tasks.findIndex((task: any) => task.uiTaskId === uiTaskId);
        if (idx !== -1) {
          workflow.tasks[idx] = { ...workflow.tasks[idx], ...data };
        }
      }
      this.newWorkflow = workflow
      return workflow;
    }
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



  setWorkFlowPayload(type: string, taskType: string, action: string, data: any, files?: any) {

    let metadata = this.payloadWorkFlow.metadata
    metadata.workflowId = this.workflowId
    metadata.workflowName = this.workflowName
    if (type === 'workflow') {
      metadata = { ...metadata, ...data }
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
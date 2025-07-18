import { Injectable } from '@angular/core';
import { transformCommentary } from '@utils/dataSubmission';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private user: any = { "userId": 1, "name": "Owner", "role": "owner" };
  private users: any[] = [];
  private workflows: any[] = [];
  private userTasks: any[] = [];
  private payloadWorkFlow: any = { metadata: {}, files: null };
  private workflowId: string;
  private workflowName: string;
  private filter: any;
  private enabledNodes: any;
  private phase: string;
  private newWorkflow: any = {}
  toastProps: any = {}

  setToastProps(toastProps: any) {
    this.toastProps = toastProps

  }
  getToastProps() {
    return this.toastProps
  }

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
      tasks: data?.tasks || [],
    }
    this.newWorkflow = workflow
  }

  getNewWorkflow() {
    return this.newWorkflow;
  }

  setWorkflows(workflows: any[]) {
    workflows.forEach(workflow => {
      const allFiles: any[] = [];
      const uploadTasks = workflow.tasks.filter((task: any) => task.taskType === 'upload').map((w: any) => w.files);
      workflow.commentary = transformCommentary(workflow.commentary, null, true)
      uploadTasks.forEach((filesArr: any) => {
        if (Array.isArray(filesArr)) {
          allFiles.push(...filesArr);
        }
      });
      if (workflow.drawflow) {
        workflow.drawflow = typeof workflow.drawflow === 'string' ? JSON.parse(workflow.drawflow) : workflow.drawflow;
      } else {
        workflow.drawflow = {}
      }
      workflow.allFiles = allFiles
      
    });
    const newWorkflowWithFiles: any = workflows.map((workflow: any) => {
      workflow.tasks = workflow.tasks.map((task: any) => {
        return { ...task, files: workflow.allFiles };
      });
      delete workflow.allFiles
      return workflow;
    });

    this.workflows = newWorkflowWithFiles;
  } 

  getWorkflows() {
    return this.workflows;
  }
  getUserTasks() {
    return this.userTasks;
  }

  setUserTasks(userTasks: any[]) {
    this.userTasks = userTasks;
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

  setFilesFromUploadTasks(workflow: any, data: any) {
    if(data.uploadType) {
      if (!workflow.files) {
        workflow.files = [];
      }
      if (data.files && Array.isArray(data.files)) {
        workflow.files = {
          ...workflow.files,
          [data.uploadType]: data.files
        };
      }
    }
  }

  // link task to a new workflow
  updateTaskById(uiTaskId: string, data: any) {
    if (this.phase === 'creation') {
      const workflow = this.newWorkflow;
      workflow.workflowName = this.workflowName || null;
      if (data.taskType === 'upload') {
        // data.files is object add files to workflow.files
        // add files to workflow
        this.setFilesFromUploadTasks(workflow, data)
       /*  if (!workflow.files) {
          workflow.files = [];
        }
        if (data.files && Array.isArray(data.files)) {
          workflow.files = {
            ...workflow.files,
            [data.uploadType]: data.files
          };
        } */

        workflow.uploadType = data.uploadType
        // check id upload task exits in the tasks array
        const taskExists = workflow.tasks.length > 0 ? workflow.tasks.find((task: any) => task.uiTaskId === data.uiTaskId) : false
        if (!taskExists) {
          workflow.tasks.push(data)
        } else {
          // Update the existing task
          const existingTaskIndex = workflow.tasks.findIndex((task: any) => task.uiTaskId === data.uiTaskId);
          if (existingTaskIndex !== -1) {
            workflow.tasks[existingTaskIndex] = { ...workflow.tasks[existingTaskIndex], ...data };
          }
        }
      } else {
        const existingTaskIndex = workflow.tasks.findIndex((task: any) => task.uiTaskId === data.uiTaskId);
        if (existingTaskIndex !== -1) {
          workflow.tasks[existingTaskIndex] = { ...workflow.tasks[existingTaskIndex], ...data };
        } else {
          workflow.tasks.push(data)
        }
      }
      this.newWorkflow = workflow;
      console.log("returning workflow for save>>>>>>>>>>>>>>>  :", workflow)
      return workflow;
    } else if (this.phase === 'execution') {
      const workflow = this.workflows.find((w: any) => w.workflowId === this.workflowId);
      // Check if workflow.tasks has files with size in it
      workflow.files = {}
      this.setFilesFromUploadTasks(workflow, data)
      if (workflow && Array.isArray(workflow.tasks)) {
        const idx = workflow.tasks.findIndex((task: any) => task.uiTaskId === uiTaskId);
        if (idx !== -1) {
          workflow.tasks[idx] = { ...workflow.tasks[idx], ...data };
        }
      }
      this.newWorkflow = workflow
      console.log("returning workflow for save>>>>>>>>>>>>>>>  :", workflow)
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
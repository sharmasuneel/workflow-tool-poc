import getConfig from "app/config";
import { toFormData } from "./dataTransformer";

function getLatestTaskData(taskData: any, uiTaskId: string, appService: any) {
  let task = {}
  const workflow = appService.getNewWorkflow();
  task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === uiTaskId)[0] || {};
  task = { ...task, ...taskData };
  return task || {};
}

export function linkTaskToWorkflow(taskData: any, uiTaskId: string, appService: any, taskType: string) {
  getLatestTaskData(taskData, uiTaskId, appService)
  const payload = {
    ...taskData,
    taskType,
    uiTaskId,
    taskUpdatedByUserId: null,
    /* acknowledgeTask: taskData.acknowledgeTask || false,
    dashboardNotification: taskData.dashboardNotification || false,
    notifyEmail: taskData.notifyEmail || false,
    userCommentary: taskData.userCommentary || false,
    commentary: taskData.commentary || '',
    autoVersioning: taskData.autoVersioning,
    fileNames: taskData.fileNames, */
  }
  appService.updateTaskById(uiTaskId, payload)
}


export function updateWorkflow(appService: any, dataService: any, uiTaskId: string, taskData: any, popupService: any) {
  const taskUpdatedByUserId: any = appService.getUser().userId;
  taskData.status = taskData.status || 'completed'
  const payload = appService.updateTaskById(uiTaskId, { ...taskData, taskUpdatedByUserId })
  const drawFlow = JSON.stringify(payload.drawflow, null, 4)
  payload.drawflow = drawFlow
  const files = payload.files

  delete payload.files // Remove files from payload to avoid circular reference
  delete payload.uploadType // Remove uploadType from payload to avoid circular reference

  if (payload && Array.isArray(payload.tasks)) {
    payload.tasks.forEach((task: any) => {
      delete task.files;
    });
  }
  console.log('on update', payload)
  const data = toFormData({ files, metadata: JSON.stringify(payload) }, '')
  dataService.putData(getConfig().saveWorkflowWithId, data).subscribe((response: any) => {
    console.log('workflow updated successfully')
    popupService.open({ isVisible: true, type: 'update', msg: 'Workflow updated successfully', btns: [{ label: 'Go to Dashboard', click: 'navigate', navigateTo: '', primary: true }] });

  })
}


export function createWorkflow(appService: any, dataService: any, popupService: any, drawflow: any) {
  const payload = appService.getNewWorkflow()
  if (!payload.tasks || payload.tasks.length === 0) {
    popupService.open({ isVisible: true, type: 'error', msg: 'No task are added to workflow' });
  } else {

    const files = payload.files
    const uploadType = payload.uploadType
    payload.drawflow = drawflow
    delete payload.files // Remove files from payload to avoid circular reference
    delete payload.uploadType // Remove uploadType from payload to avoid circular reference
    if (payload && Array.isArray(payload.tasks)) {
      payload.tasks.forEach((task: any) => {
        delete task.files;
      });
    }
    console.log('on create', payload)
    const data = toFormData({ files, metadata: JSON.stringify(payload) }, uploadType);
    dataService.postData(getConfig().saveWorkflow, data).subscribe((response: any) => {
      console.log('Workflow created successfully')
      popupService.open({ isVisible: true, type: 'save', msg: 'Workflow saved successfully', btns: [{ label: 'Go to Dashboard', click: 'navigate', navigateTo: '', primary: true }] });
    })
  }
}
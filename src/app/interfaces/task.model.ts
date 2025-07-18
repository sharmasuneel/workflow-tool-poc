export interface TaskFile {
  fileId: number;
  name: string;
  fileType: string;
}

export interface TaskQuery {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  taskId: string;
  content: {
    text: string;
  };
  status: string;
}

export interface Task {
  workflowId: string,
  uiWorkflowId: string,
  workflowName: string,
  workFlowStatus: string,
  workflowCreatedBy: string,
  workflowTriggerType: string,
  drawflow: string,
  frequency: string,
  description: string,
  task: {
    taskId: number;
    taskName: string;
    taskStatus: string;
    taskAssignedTo: string;
    taskEndDate: string;
    taskEndTime: string;
    taskCompletionDate: string;
    taskCompletionTime: string;
    taskType: string;
    taskAutoVersioning: boolean;
    taskCaptureComments: boolean;
    taskUiId: string;
    taskFileHistory: boolean;
    taskQuery: boolean;
    taskQueries: TaskQuery[]; // You can define a more specific type if needed
    retainFile: boolean;
    taskOutcomes: string[];
    taskOutcome: string;
    taskHolidayCalenderRegion: string;
    taskFiles: TaskFile[];
  }
}


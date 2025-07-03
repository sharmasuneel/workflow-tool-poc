export interface TaskFile {
    fileId: number;
    name: string;
    fileType: string;
  }
  
  export interface Task {
    taskId: number;
    taskName: string;
    taskStatus: string;
    taskAssignedTo: string;
    taskEndDate: string;
    taskEndTime: string;
    taskCompletionDate: string;
    taskCompletionTime: string;
    taskType: string;
    taskBusinessName: string;
    taskAutoVersioning: boolean;
    taskCaptureComments: boolean;
    taskUiId: string;
    taskFileHistory: boolean;
    taskQuery: boolean;
    taskQueries: any[]; // You can define a more specific type if needed
    retainFile: boolean;
    taskOutcomes: string[];
    taskOutcome: string;
    taskHolidayCalenderRegion: string;
    taskFiles: TaskFile[];
  }
  
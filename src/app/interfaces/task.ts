export interface Task {
    taskId?: number;
    version?: number;
    name?: string;
    businessName?: string;
    taskUpdatedByUserId?: number;
    fileType?: string;
    autoVersioning?: string;
    fileNames?: string[];
    taskType?: string;
    acknowledgeType?: string;
    commentary?: string;
    status?: string;
    uploadType?: string;
    uiTaskId?: string;
}

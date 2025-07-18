import { Task } from './task.model';
import { WorkflowParameters} from './parameters.model';

export interface Workflow {
  workflowId: number;
  uiWorkflowId: string;
  workflowName: string;
  workFlowStatus: string;
  workflowCreatedBy: number;
  workflowTriggerType: string;
  drawflow: string;
  frequency: string;
  description: string;
  tasks: Task[];
  defaultParameters: WorkflowParameters;
}

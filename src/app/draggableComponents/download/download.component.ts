import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
import getConfig from '../../config';
import { toFormData } from '../../utils/dataTransformer';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent],
  standalone: true,
})
export class DownloadComponent {
  acknowledged = false;
  notifyEmail = false;
  notifyDashboard = false;
  userCommentary = false;
  phase: string;
  comments: string;
  acknowledgeTask: string;
  toastMsg: string;
  private appService = inject(AppService);
  private dataService = inject(DataService);

  onSave() {
    const workflowId = this.appService.getWorkflowId()
    this.appService.setWorkFlowPayload('task', 'download', 'update', {
      workflowId,
      acknowledged: this.acknowledged,
      notifyEmail: this.notifyEmail,
      notifyDashboard: this.notifyDashboard,
      userCommentary: this.userCommentary,
      taskType: 'download'
    });
  }

  onComplete() {
    const workflowId = this.appService.getWorkflowId()
    const workFlow =  this.appService.getWorkflowById(Number(workflowId))
    const tasks = workFlow.metadata.tasks.filter((task: any) => task.taskId === 'download')
    this.appService.setWorkFlowPayload('task', 'download', 'update', {
      workflowId,
      acknowledged: this.acknowledged,
      notifyEmail: this.notifyEmail,
      notifyDashboard: this.notifyDashboard,
      userCommentary: this.userCommentary,
      taskType: 'download',
      comments: this.comments
    });

    const payload = this.appService.getWorkFlowPayload()
    
    payload.metadata = { ...payload.metadata, drawflow: payload.metadata.drawflow }
    const data = toFormData({ files: payload.files, metadata: JSON.stringify(payload.metadata) })
    this.dataService.postData(getConfig().saveWorkflowWithId, data).subscribe((response) => {
          console.log('Workflow saved successfully:', response);
    
          //TODO show alert message
          //this.showToast = true
          this.toastMsg = 'Workflow saved successfully'
        })
  }

  ngOnInit() {
    this.phase = this.appService.getPhase()
  }
}

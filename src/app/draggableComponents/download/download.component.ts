import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { AppService } from '../../services/app.service';

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
  private appService = inject(AppService);

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
}

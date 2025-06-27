import { CommonModule } from '@angular/common';
import { Component,ViewChild, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { AppService } from '../../services/app.service';
import getConfig from '../../config';
import { toFormData } from '../../utils/dataTransformer';
import { DataService } from '../../services/data.service';
import { ToastComponent } from '../../common/toast/toast.component';
import { FilesSectionComponent } from 'app/common/files-section/files-section.component';
import { NotificationManagementComponent } from 'app/common/notification-management/notification-management.component';
declare var bootstrap:any;
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent, FilesSectionComponent, NotificationManagementComponent],
  standalone: true,
})
export class ReviewComponent {

  @Input() uiTaskId: string;
  taskData: any = {};
  toastMsg: string;
  showToast: boolean = false;
  phase: string;
  downloadUrl: string = getConfig().downlodFile;
  rejectComment: string;
  private appService = inject(AppService);
  private dataService = inject(DataService);

  @ViewChild('approveModal') approveModal:any

  @Input() save: any = () => {
     this.onSave();
  }
  @Input() approve: any = () => {
    this.openApproveFilePopup();
  }
  @Input() reject: any = () => {
    this.openRejectFilePopup();
  }

  ngOnInit() {
    this.phase = this.appService.getPhase();
    let task = {};
    if (this.phase === 'creation') {
      const workflow = this.appService.getNewWorkflow();
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      task = { ...task, ...this.taskData };
      this.taskData = task || {};
    } else {
      const workflowId = this.appService.getWorkflowId();
      const workflow = this.appService.getWorkflowById(Number(workflowId));
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      this.taskData = task || {}
    }
  }

  onSave() {
    this.taskData = {
      ...this.taskData,
      taskType: 'review',
      uiTaskId: this.uiTaskId,
      acknowledgeTask: this.taskData.acknowledgeTask || false,
      notifyEmail: this.taskData.notifyEmail || false,
      dashboardNotification: this.taskData.dashboardNotification || false,
      userCommentary: this.taskData.userCommentary || false,
      taskUpdatedByUserId: null,
    }
    this.appService.updateTaskById(this.uiTaskId, this.taskData)
  }

  onComplete() {
    const taskUpdatedByUserId: any = this.appService.getUser().userId;
    const payload = this.appService.updateTaskById(this.uiTaskId, { ...this.taskData, taskUpdatedByUserId })
    const drawFlow = JSON.stringify(payload.drawflow, null, 4)
    payload.drawflow = drawFlow
    const files = payload.files

    if (payload && Array.isArray(payload.tasks)) {
      payload.tasks.forEach((task: any) => {
        delete task.files;
      });
    }

    delete payload.files // Remove files from payload to avoid circular reference
    delete payload.uploadType // Remove uploadType from payload to avoid circular reference

    const data = toFormData({ files, metadata: JSON.stringify(payload) }, '')
    this.dataService.putData(getConfig().saveWorkflow, data).subscribe((response: any) => {
    })
  }

  openFile(evt: MouseEvent, taskfile: any) {
    evt.preventDefault();
    evt.stopPropagation();
    const fileUrl = this.taskData.fileUrl;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      console.error('No file URL provided');
    }

  }
  openApproveFilePopup() {
    const modalPopup = document.getElementById('aprroveModalPopup');
    if (modalPopup) {
      modalPopup.style.display = 'block';
    }
}
closeApproveFilePopup() {
    const modalPopup = document.getElementById('aprroveModalPopup');
    if (modalPopup) { 
    
    modalPopup.style.display = 'none';
    }
  }


  approveFile() {

  }

  openRejectFilePopup() {
    const modalPopup = document.getElementById('rejectModalPopup');
    if (modalPopup) {
      modalPopup.style.display = 'block';
    }
}
closeRejectFilePopup() {
    const modalPopup = document.getElementById('rejectModalPopup');
    if (modalPopup) { 
    
    modalPopup.style.display = 'none';
    }
  }


  rejectFile() {

  }

}

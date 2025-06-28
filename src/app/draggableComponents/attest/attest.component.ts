import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { AppService } from '../../services/app.service';
import getConfig from '../../config';
import { toFormData } from '../../utils/dataTransformer';
import { DataService } from '../../services/data.service';
import { ToastComponent } from '../../common/toast/toast.component';
import { FilesSectionComponent } from 'app/common/files-section/files-section.component';
import { NotificationManagementComponent } from 'app/common/notification-management/notification-management.component';
import { linkTaskToWorkflow, updateWorkflow } from 'app/utils/dataSubmission';

@Component({
  selector: 'app-review',
  templateUrl: './attest.component.html',
  styleUrls: ['./attest.component.scss'],
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent, FilesSectionComponent, NotificationManagementComponent],
  standalone: true,
})
export class AttestComponent {

  @Input() uiTaskId: string;
  taskData: any = {};
  toastMsg: string;
  showToast: boolean = false;
  phase: string;
  downloadUrl: string = getConfig().downlodFile;

  private appService = inject(AppService);
  private dataService = inject(DataService);

  @Input() save: any = () => {
    this.onSave();
  }
  @Input() complete: any = () => {
    this.onComplete();
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
    linkTaskToWorkflow(this.taskData, this.uiTaskId, this.appService, 'attest')
  }

  onComplete() {
    updateWorkflow(this.appService, this.dataService, this.uiTaskId, this.taskData, this.popupService)
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
}

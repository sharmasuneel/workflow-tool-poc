import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
import getConfig from '../../config';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { toFormData } from '../../utils/dataTransformer'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent],
  standalone: true,
  styleUrls: ['./upload.component.scss'],
})

export class UploadComponent implements OnInit {

  // task related variables
  @Input() uiTaskId: string;
  taskData: any = {};
  toastMsg: string;
  showToast: boolean = false;
  phase: string;

  private appService = inject(AppService);
  private dataService = inject(DataService);
  private toastr = inject(ToastrService);

  users: string[] = [];
  preparators: any[] = []
  approvers: any[] = []
  reviewers: any[] = []
  containerClass: "st1"

  ngOnInit() {
    this.phase = this.appService.getPhase();
    this.users = this.appService.getUsers();
    this.preparators = this.users.filter((item: any) => item.type === "preparator");
    this.approvers = this.users.filter((item: any) => item.type === "approver");
    this.reviewers = this.users.filter((item: any) => item.type === "reviewer");
    let task = {};
    if (this.phase === 'creation') {
      const workflow = this.appService.getNewWorkflow();
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      task = { ...task, ...this.taskData };
      this.taskData = task || {};
    } else {
      this.taskData.uploadType = 'withDataFile' 
      this.taskData.assignedTo = 'rahul' 
      const workflowId = this.appService.getWorkflowId();
      const workflow = this.appService.getWorkflowById(Number(workflowId));
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      this.taskData = task || {};
    }
  }

  getId(key: string, arr: any) {
    return arr.filter((item: any) => item.name === key).map((item: any) => item.userGroupId)[0]
  }

  removeFile(fileIndex: number) {
    this.taskData.fileNames.splice(fileIndex, 1);
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.taskData.fileNames = Array.from(input.files).map(file => file.name);
      this.taskData.files = Array.from(input.files);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.taskData.fileNames = Array.from(event.dataTransfer.files).map(file => file.name);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onSave() {
    this.taskData = {
      ...this.taskData,
      taskType: 'upload',
      acknowledgeTask: this.taskData.acknowledgeTask || false,
      dashboardNotification: this.taskData.dashboardNotification || false,
      notifyEmail: this.taskData.notifyEmail || false,
      userCommentary: this.taskData.userCommentary || false,
      commentry: this.taskData.commentry || '',
      taskUpdatedByUserId: null,
      businessName: this.taskData.businessName,
      preparator: this.getId(this.taskData.preparator, this.preparators),
      reviewer: this.getId(this.taskData.reviewer, this.reviewers),
      approver: this.getId(this.taskData.approver, this.approvers),
      fileType: this.taskData.fileType,
      autoVersioning: this.taskData.autoVersioning,
      fileNames: this.taskData.fileNames,
    }
    this.appService.updateTaskById(this.uiTaskId, this.taskData)
    console.log('Upload Task data updated:', this.taskData);
  }

  onComplete() {
    const taskUpdatedByUserId: any = this.appService.getUser().userId;
    const payload = this.appService.updateTaskById(this.uiTaskId, { ...this.taskData, taskUpdatedByUserId })
    const data = toFormData({ metadata: JSON.stringify(payload) }, '')
    this.dataService.postData(getConfig().saveWorkflowWithId, data).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
      //TODO show alert message
      this.showToast = true
      this.toastMsg = 'Workflow saved successfully'
    })
  }
}

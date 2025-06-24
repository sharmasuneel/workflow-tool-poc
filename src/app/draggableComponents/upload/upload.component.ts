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

  /* fileName: string = '';
  businessName: string = '';
  preparator: string = '';
  reviewer: string = '';
  approver: string = '';
  fileType: string = '';
  file: any = null;
  files: any[] = [];
  autoVersioning: boolean = false; */

  private appService = inject(AppService);
  private dataService = inject(DataService);
  private toastr = inject(ToastrService);



  //fileNames: string[] = [];


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
    /* setTimeout(() => {
      console.log('Upload component initialized', this.uiTaskId);
      this.users = this.appService.getUsers();
      this.preparators = this.users.filter((item: any) => item.type === "preparator");
      this.approvers = this.users.filter((item: any) => item.type === "approver");
      this.reviewers = this.users.filter((item: any) => item.type === "reviewer");
    }, 100); */
  }

  getId(key: string, arr: any) {
    return arr.filter((item: any) => item.name === key).map((item: any) => item.userGroupId)[0]
  }

  removeFile(fileIndex: number) {
    this.taskData.fileNames.splice(fileIndex, 1);
  }

  updateWorkFlowPayload() {
    this.appService.setWorkFlowPayload('workflow', '', '', {
      approverGroupId: this.getId(this.approver, this.approvers),
      reviewerGroupId: this.getId(this.reviewer, this.reviewers),
      preparatorGroupId: this.getId(this.preparator, this.preparators),
      createdBy: this.appService.getUser().userId,
      progress: 0,
      status: "",
      commentary: "",
    })
    this.appService.setWorkFlowPayload('task', 'upload', 'update', {
      businessName: this.businessName,
      // preparator: this.getId(this.preparator, this.preparators),
      uploadType: this.uploadType,
      // reviewer: this.getId(this.reviewer, this.reviewers),
      // approver: this.getId(this.approver, this.approvers),
      taskUpdatedByUserId: this.appService.getUser().userId,
      fileType: this.fileType,
      autoVersioning: this.autoVersioning,
      taskType: 'upload',
      fileNames: this.fileNames
    }, this.files)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.taskData.fileNames = Array.from(input.files).map(file => file.name);
      this.taskData.files = Array.from(input.files);
      this.updateWorkFlowPayload()
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.taskData.fileNames = Array.from(event.dataTransfer.files).map(file => file.name);
      this.updateWorkFlowPayload()
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
      businessName: this.businessName,
      preparator: this.getId(this.preparator, this.preparators),
      reviewer: this.getId(this.reviewer, this.reviewers),
      approver: this.getId(this.approver, this.approvers),
      fileType: this.fileType,
      autoVersioning: this.autoVersioning,
      fileNames: this.fileNames,
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


  /*  const workflowId = this.appService.getWorkflowId()
   const jsonformData = {
     workflowId: workflowId,
     businessName: this.businessName,
     preparator: this.getId(this.preparator, this.preparators),
     reviewer: this.getId(this.reviewer, this.reviewers),
     approver: this.getId(this.approver, this.approvers),
     fileType: this.fileType,
     autoVersioning: this.autoVersioning,
     fileNames: this.fileNames,
     taskType: 'upload'
   };

   const data = toFormData({ files: this.files, metadata: JSON.stringify(jsonformData) }, this.uploadType)
   this.dataService.postData(getConfig().upload, data).subscribe({
     next: (response) => {
       this.toastr.success(
         `<i class="fa fa-check-circle" style="color:rgb(26, 27, 26); margin-right: 12px; border-radius: 1px"></i> Template task attached to workflow ${jsonformData.workflowId} successfully`,
         '',
         {
           enableHtml: true,
           timeOut: 6000,
           progressBar: true,
           // closeButton: true,
           positionClass: 'toast-top-right',
           toastClass: 'cust-toast ngx-toastr-transparent-bg'
         }
       );
       console.log('Data saved successfully:', response);
     }
     , error: (error) => {
       console.error('Error saving data:', error);
     }
   });
   console.log('Saved Data:', data);
 } */


}

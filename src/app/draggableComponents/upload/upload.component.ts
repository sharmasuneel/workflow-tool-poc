import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
import getConfig from '../../config';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { toFormData } from '../../utils/dataTransformer'
import { PopupService } from 'app/services/popup.service';
import { NotificationManagementComponent } from 'app/common/notification-management/notification-management.component';
import { linkTaskToWorkflow, updateWorkflow } from 'app/utils/dataSubmission';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent, NotificationManagementComponent],
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
  private popupService = inject(PopupService);
  // private toastr = inject(ToastrService);

  users: any = {};
  preparators: any[] = []
  approvers: any[] = []
  reviewers: any[] = []
  containerClass: "st1";
  dd: any

  @Input() save: any = () => {
    this.onSave();
  }
  @Input() complete: any = () => {
    this.onComplete();
  }

  ngOnInit() {
    this.phase = this.appService.getPhase();
    this.users = this.appService.getUsers();
    this.preparators = [this.users.preparator];
    this.approvers = [this.users.approver];
    this.reviewers = [this.users.reviewer];
    let task: any = {};
    if (this.phase === 'creation') {
      this.getLatestTaskData()
    } else {
      const workflowId = this.appService.getWorkflowId();
      const workflow = this.appService.getWorkflowById(Number(workflowId));
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      this.taskData = { ...task, uploadType: task.uploadType, assignedTo:  task.uploadType === 'withDataFile' ? 'rahul' : '' };
    }
  }
  
  getLatestTaskData() {
    let task = {}
    const workflow = this.appService.getNewWorkflow();
    task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
    task = { ...task, ...this.taskData};
    this.taskData = task || {};
    console.log(this.taskData)
    this.dd = JSON.stringify(this.taskData)
  }

  getId(key: string, arr: any) {
    const dd = arr.filter((item: any) => item.name === key).map((item: any) => item.userGroupId)[0]
    return dd || null;
  }

  removeFile(fileIndex: number) {
    this.taskData.fileNames.splice(fileIndex, 1);
  }

  addSection() {
    if (!this.taskData.sections) {
      this.taskData.sections = [];
    }
    const newSection = {
      sectionName: '',
      sectionDescription: '',
    };
    this.taskData.sections.push(newSection);
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
    linkTaskToWorkflow(this.taskData, this.uiTaskId, this.appService, 'upload')
  }

  onComplete() {
    updateWorkflow(this.appService,this.dataService, this.uiTaskId, {...this.taskData, status: 'completed'}, this.popupService)
  }
  openFileHistoryPopup() {
    this.popupService.open({ isVisible: true, title: 'File History?', type: 'history' });
  }
  closeFileHistoryPopup() {
    const element = document.getElementById('fileHistory');
    if (element) {
      element.style.display = 'none';
    }
  }
}

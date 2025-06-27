import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
import getConfig from '../../config';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { toFormData } from '../../utils/dataTransformer'
import { ToastrService } from 'ngx-toastr';
import { ToastComponent } from '../../common/toast/toast.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent, ToastComponent],
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

  users: any = {};
  preparators: any[] = []
  approvers: any[] = []
  reviewers: any[] = []
  containerClass: "st1";
  filehistory = [
    {
      businessDate: '2025-06-25',
      name: 'Quarterly_Report_Q2_2025.xlsx',
      uploadedBy: 'Ravi Mehta',
      version: 'v1.0',
      uploadDate: '2025-06-26'
    },
    {
      businessDate: '2025-06-26',
      name: 'Transaction_Log_June.csv',
      uploadedBy: 'Anjali Rao',
      version: 'v2.1',
      uploadDate: '2025-06-27'
    },
    {
      businessDate: '2025-06-27',
      name: 'Revenue_Summary_2025.pdf',
      uploadedBy: 'Devansh Iyer',
      version: 'v1.3',
      uploadDate: '2025-06-28'
    }
  ];

  @Input () save: any= () => {
    this.onSave();  
  }
  @Input () complete: any= () => {
    this.onComplete();  
  }

  ngOnInit() {
    this.phase = this.appService.getPhase();
    this.users = this.appService.getUsers();
    this.preparators = [this.users.preparator];
    this.approvers = [this.users.approver];
    this.reviewers = [this.users.reviewer];
    let task = {};
    if (this.phase === 'creation') {
      this.getLatestTaskData()
      /* const workflow = this.appService.getNewWorkflow();
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      task = { ...task, ...this.taskData };
      this.taskData = task || {}; */
    } else {
      const workflowId = this.appService.getWorkflowId();
      const workflow = this.appService.getWorkflowById(Number(workflowId));
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      this.taskData = { ...task, uploadType: 'withDataFile', assignedTo: 'rahul' };
    }
  }

  getLatestTaskData() {
    let task = {}
    const workflow = this.appService.getNewWorkflow();
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      task = { ...task, ...this.taskData };
      this.taskData = task || {};
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
    this.getLatestTaskData()
    const payload = {
      ...this.taskData,
      taskType: 'upload',
      uiTaskId: this.uiTaskId,
      acknowledgeTask: this.taskData.acknowledgeTask || false,
      dashboardNotification: this.taskData.dashboardNotification || false,
      notifyEmail: this.taskData.notifyEmail || false,
      userCommentary: this.taskData.userCommentary || false,
      commentry: this.taskData.commentry || '',
      taskUpdatedByUserId: null,
      autoVersioning: this.taskData.autoVersioning,
      fileNames: this.taskData.fileNames,
    }
    this.appService.updateTaskById(this.uiTaskId, payload)
    console.log('Upload Task data updated:', this.taskData);
  }

  onComplete() {
    const taskUpdatedByUserId: any = this.appService.getUser().userId;
    const payload = this.appService.updateTaskById(this.uiTaskId, { ...this.taskData, taskUpdatedByUserId })
    const drawFlow = JSON.stringify(payload.drawflow, null, 4)
    payload.drawflow = drawFlow

    delete payload.files // Remove files from payload to avoid circular reference
    delete payload.uploadType // Remove uploadType from payload to avoid circular reference

    if (payload && Array.isArray(payload.tasks)) {
      payload.tasks.forEach((task: any) => {
        delete task.files;
      });
    }

    const data = toFormData({ metadata: JSON.stringify(payload) }, '')
    this.dataService.putData(getConfig().saveWorkflowWithId, data).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
      //TODO show alert message
      this.showToast = true
      this.toastMsg = 'Workflow saved successfully'
    })
  }
  openFileHistoryPopup(){
    const element = document.getElementById('fileHistory');
    if (element) {  
      element.style.display = 'block';
    }
  }
  closeFileHistoryPopup(){
    const element = document.getElementById('fileHistory');
    if (element) {  
      element.style.display = 'none';
    }
  }
}

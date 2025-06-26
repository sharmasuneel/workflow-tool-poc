import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
import getConfig from '../../config';
import { toFormData } from '../../utils/dataTransformer';
import {MatInputModule} from '@angular/material/input';
import { ToastComponent } from '../../common/toast/toast.component';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent, MatInputModule, ToastComponent],
  standalone: true,
})
export class DownloadComponent implements OnInit {

  // task related variables
  @Input() uiTaskId: string;
  taskData: any = {};
  toastMsg: string;
  showToast:boolean = false;
  phase: string;
  downloadUrl: string = getConfig().downlodFile;

  //services 
  private appService = inject(AppService);
  private dataService = inject(DataService);


  @Input() workflowType: string;
  
  @Input () save: any= () => {
    this.onSave();  
  }
  @Input () complete: any= () => {
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
      this.taskData = task || {};
    }
  }

  onSave() {
    this.taskData = {
      ...this.taskData,
      taskType: 'download',
      uiTaskId: this.uiTaskId,
      acknowledgeTask: this.taskData.acknowledgeTask || false,
      dashboardNotification: this.taskData.dashboardNotification || false,
      notifyEmail: this.taskData.notifyEmail || false,
      userCommentary: this.taskData.userCommentary || false,
      commentry: this.taskData.commentry || '',
      taskUpdatedByUserId: null,
    }
    this.appService.updateTaskById(this.uiTaskId, this.taskData)
    console.log('Task data updated:', this.taskData);
  }

  onComplete() {
    const taskUpdatedByUserId: any = this.appService.getUser().userId;
    const payload = this.appService.updateTaskById(this.uiTaskId, { ...this.taskData, taskUpdatedByUserId })
    const drawFlow = JSON.stringify(payload.drawflow, null, 4)
    payload.drawflow = drawFlow

    if (payload && Array.isArray(payload.tasks)) {
      payload.tasks.forEach((task: any) => {
        delete task.files;
      });
    }

    delete payload.files // Remove files from payload to avoid circular reference
    delete payload.uploadType // Remove uploadType from payload to avoid circular reference

    const data = toFormData({ metadata: JSON.stringify(payload) }, '')
    this.dataService.putData(getConfig().saveWorkflowWithId, data).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
      //TODO show alert message
      this.showToast = true
      this.toastMsg = 'Workflow saved successfully'
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

  removeFile(fileIndex: number) {
    this.taskData.files.splice(fileIndex, 1);
  }
}

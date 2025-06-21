import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
import getConfig from '../../config';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { toFormData } from '../../utils/dataTransformer'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent],
  standalone: true,
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  fileName: string = '';
  businessName: string = 'Finance Audit of India';
  preparator: string = '';
  reviewer: string = '';
  approver: string = '';
  fileType: string = 'CSV';
  file: any = null;
  files: any[] = [];
  autoVersioning: boolean = false;

  private appService = inject(AppService);
  private dataService = inject(DataService);


  fileNames: string[] = [];


  users: string[] = [];

  preparators: any[] = []
  approvers: any[] = []
  reviewers: any[] = []
  containerClass: "st1"
  uploadType: string

  ngOnInit() {
    setTimeout(() => {
      this.users = this.appService.getUsers();
      this.preparators = this.users.filter((item: any) => item.type === "preparator");
      this.approvers = this.users.filter((item: any) => item.type === "approver");
      this.reviewers = this.users.filter((item: any) => item.type === "reviewer");
    }, 100);
  }

  getId(key: string, arr: any) {
    return arr.filter((item: any) => item.name === key).map((item: any) => item.userGroupId)[0]

  }

  updateWorkFlowPayload() {
    this.appService.setWorkFlowPayload('task', 'upload', 'update', { businessName: this.businessName,
      preparator: this.getId(this.preparator, this.preparators) || 1,
      reviewer: this.getId(this.reviewer, this.reviewers) || 1,
      approver: this.getId(this.approver, this.approvers) || 1,
      fileType: this.fileType,
      autoVersioning: this.autoVersioning,
      taskType: 'upload',
      fileNames: this.fileNames }, this.files)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.fileNames = Array.from(input.files).map(file => file.name);
      this.files = Array.from(input.files);
      this.updateWorkFlowPayload()
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.fileNames = Array.from(event.dataTransfer.files).map(file => file.name);
      this.updateWorkFlowPayload()
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onSave() {
    const workflowId = this.appService.getWorkflowId()
    if(!workflowId) {
      alert('WorkflowId missing')
      return
    }

    const jsonformData = {
      workflowId: workflowId,
      businessName: this.businessName,
      preparator: this.getId(this.preparator, this.preparators) || 1,
      reviewer: this.getId(this.reviewer, this.reviewers) || 1,
      approver: this.getId(this.approver, this.approvers) || 1,
      fileType: this.fileType,
      autoVersioning: this.autoVersioning,
      fileNames: this.fileNames,
      taskType: 'upload'
    };

    const data = toFormData({ files: this.files, metadata: JSON.stringify(jsonformData) })
    this.dataService.postData(getConfig().upload, data).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
      }
      , error: (error) => {
        console.error('Error saving data:', error);
      }
    });
    console.log('Saved Data:', data);
  }


}

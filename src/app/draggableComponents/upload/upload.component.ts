import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
  fileName: string = '';
  businessName: string = '';
  preparator: string = '';
  reviewer: string = '';
  approver: string = '';
  fileType: string = '';
  file: any = null;
  files: any[] = [];
  autoVersioning: boolean = false;

  private appService = inject(AppService);
  private dataService = inject(DataService);
  private toastr = inject(ToastrService);


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
      preparator: this.getId(this.preparator, this.preparators),
      uploadType: this.uploadType,
      reviewer: this.getId(this.reviewer, this.reviewers),
      approver: this.getId(this.approver, this.approvers),
      fileType: this.fileType,
      autoVersioning: this.autoVersioning,
      taskType: 'upload',
      fileNames: this.fileNames
    }, this.files)
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

    const data = toFormData({ files: this.files, metadata: JSON.stringify(jsonformData) })
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
  }


}

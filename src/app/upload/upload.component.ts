import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app.service';
import { DataService } from '../services/data.service';
import getConfig from '../config';
import { DropWrapperContainerComponent } from '../common/drop-wrapper-container/drop-wrapper-container.component';

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
  autoVersioning: boolean = false;
  isExpanded: boolean = true;
  private appService = inject(AppService);
  private dataService = inject(DataService);

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

  toggleUpload() {
    this.isExpanded = !this.isExpanded;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.file = file;
    this.fileName = file.name;
  }
  
  onFileDrop(event: DragEvent) {
    debugger;
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    this.file = file;
    this.fileName = file?.name ?? '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  toFormData(obj: any): FormData {
    const formData = new FormData();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }
    return formData;
  }

  onSave() {
    const jsonformData = {
      businessName: this.businessName,
      preparator: this.getId(this.preparator, this.preparators) || 1,
      reviewer: this.getId(this.reviewer, this.reviewers) || 1,
      approver: this.getId(this.approver, this.approvers) || 1,
      fileType: this.fileType,
      autoVersioning: this.autoVersioning,
      fileName: this.fileName
    };

    const fileData = {
     file: this.file,
     metadata: JSON.stringify(jsonformData)
    };
    const data = this.toFormData(fileData)

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

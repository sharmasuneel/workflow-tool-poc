import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app.service';
import { DataService } from '../services/data.service';
import getConfig from '../config';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  imports: [CommonModule, FormsModule],
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
  autoVersioning: boolean = false;
  isExpanded: boolean = true;
  private appService = inject(AppService);
  private dataService = inject(DataService);

  users: string[] = [];

  preparators: any[] = []
  approvers: any[] = []
  reviewers: any[] = []

  ngOnInit() {
    setTimeout(() => {
      this.users = this.appService.getUsers();
      this.preparators = this.users.filter((item: any) => item.type === "preparator");
      this.approvers = this.users.filter((item: any) => item.type === "approver");
      this.reviewers = this.users.filter((item: any) => item.type === "reviewer");
    }, 100);
  }

  toggleUpload() {
    this.isExpanded = !this.isExpanded;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    debugger;
    this.fileName = file.name;
  }

  onFileDrop(event: DragEvent) {
    debugger;
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    this.fileName = file?.name ?? '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onSave() {
    const formData = {
      businessName: this.businessName,
      preparator: this.preparator,
      reviewer: this.reviewer,
      approver: this.approver,
      fileType: this.fileType,
      autoVersioning: this.autoVersioning,
      fileName: this.fileName
    };

    this.dataService.postData(getConfig().upload, formData).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
      }
      , error: (error) => {
        console.error('Error saving data:', error);
      }
    });
    console.log('Saved Data:', formData);
  }
}

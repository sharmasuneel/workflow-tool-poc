import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  fileName: string = '';
  businessName: string = 'Finance Audit of India';
  preparator: string = '';
  reviewer: string = '';
  approver: string = '';
  fileType: string = 'CSV';
  autoVersioning: boolean = false;
  isExpanded: boolean = true;

  users: string[] = ['User A', 'User B', 'User C'];

  toggleUpload() {
    this.isExpanded = !this.isExpanded;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.fileName = file.name;
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.fileName = file.name;
    }
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
    console.log('Saved Data:', formData);
  }
}

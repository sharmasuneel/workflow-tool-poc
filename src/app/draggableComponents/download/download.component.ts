import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent],
  standalone: true,
})
export class DownloadComponent {
  acknowledged = false;
  notifyEmail = false;
  notifyDashboard = false;
  userCommentary = false;
  isExpanded: boolean = true;


  toggleDownload() {
    this.isExpanded = !this.isExpanded;
  }

  onSave() {
    console.log('Saved settings:', {
      acknowledged: this.acknowledged,
      notifyEmail: this.notifyEmail,
      notifyDashboard: this.notifyDashboard,
      userCommentary: this.userCommentary,
    });
  }
}

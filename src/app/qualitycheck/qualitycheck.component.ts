import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review',
  templateUrl: './qualitycheck.component.html',
  styleUrls: ['./qualitycheck.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class QualityCheckComponent {
  notifyEmail = true;
  notifyDashboard = true;
  userCommentary = false;
  isExpanded: boolean = true;
  toggleQualityCheck() {
    this.isExpanded = !this.isExpanded;
  }

  onSave() {
    console.log('Saved settings:', {
      notifyEmail: this.notifyEmail,
      notifyDashboard: this.notifyDashboard,
      userCommentary: this.userCommentary,
    });
  }
}

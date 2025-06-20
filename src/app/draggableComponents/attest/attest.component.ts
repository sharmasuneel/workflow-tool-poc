import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';

@Component({
  selector: 'app-attestation',
  templateUrl: './attest.component.html',
  styleUrls: ['./attest.component.scss'],
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent],
  standalone: true,
})
export class AttestComponent {
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

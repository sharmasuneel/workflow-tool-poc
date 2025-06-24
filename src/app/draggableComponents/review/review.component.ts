import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  imports: [CommonModule, FormsModule, DropWrapperContainerComponent],
  standalone: true,
})
export class ReviewComponent {
  notifyEmail = true;
  notifyDashboard = true;
  userCommentary = false;

  @Input() uiTaskId: string;

  onSave() {
    console.log('Saved settings:', {
      notifyEmail: this.notifyEmail,
      notifyDashboard: this.notifyDashboard,
      userCommentary: this.userCommentary,
    });
  }
}

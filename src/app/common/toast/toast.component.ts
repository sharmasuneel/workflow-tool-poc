import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  showCreateWorkflow: boolean = true
  newWorkflowName: string = ''
  createNewWorkFlow() {

  }

}

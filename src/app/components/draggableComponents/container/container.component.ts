import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../../services/app.service';
import { PopupService } from "../../../services/popup.service";
@Component({
  selector: 'drop-container',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})


export class ContainerComponent implements OnInit {

  isExpanded: boolean = true;
  @Output() save = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();
  @Output() approve = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();
  @Input() taskType: string = "";
  @Input() taskData: any
  phase: string;




  //services 
  private appService = inject(AppService);
  private popupService = inject(PopupService);

  toggleChildren() {
    this.isExpanded = !this.isExpanded;
  }

  onSave() {
    this.save.emit();
    this.toggleChildren();
  }
  onComplete() {
    this.complete.emit();
    this.toggleChildren();
  }
  onApprove() {
    this.popupService.open({
      type: 'approve',
      isVisible: true,
      title: 'Approve File?', msg: 'Are you sure you want to approve this file.', taskData: this.taskData, btns: [{ label: 'Approve', click: 'close', primary: true }]
    });
  }
  onReject() {
    this.popupService.open({
      title: 'Reject File?', msg: 'Are you sure you want to reject this file. Please add a comment to justify your action.',
      btns: [{ label: 'Reject', click: 'close', primary: true }],
      taskData: this.taskData,
      type: 'reject',
      isVisible: true
    });
  }
  ngOnInit(): void {
    this.phase = this.appService.getPhase();
  }
}



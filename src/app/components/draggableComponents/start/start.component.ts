import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepickerConfig, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppService } from '../../../services/app.service';
import { linkTaskToWorkflow } from 'app/utils/dataSubmission';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'setup-start',
  standalone: true,
  imports: [FormsModule, MatDatepickerModule, CommonModule, NgbTimepickerModule, ContainerComponent, NgbModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class StartComponent {
  uploadType: string = 'Auto Trigger';
  frequency: string = 'Daily';
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  startDate: Date = new Date();
  date: Date = new Date();

  // task related variables
  @Input() uiTaskId: string;
  taskData: any = {};
  toastMsg: string;
  showToast: boolean = false;
  phase: string;

  //services 
  private appService = inject(AppService);

  @Input() save: any = () => {
    this.onSave();
  }


  constructor(timepickerConfig: NgbTimepickerConfig) {
    timepickerConfig.seconds = true;
    timepickerConfig.spinners = false;
  }

  ngOnInit() {
    this.phase = this.appService.getPhase();
    let task = {};
    if (this.phase === 'creation') {
      const workflow = this.appService.getNewWorkflow();
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      task = { ...task, ...this.taskData };
      this.taskData = task || {};
    } else {
      const workflowId = this.appService.getWorkflowId();
      const workflow = this.appService.getWorkflowById(Number(workflowId));
      task = (workflow.tasks || []).filter((task: any) => task.uiTaskId === this.uiTaskId)[0] || {};
      this.taskData = task
    }
  }

  onSave() {
    this.taskData = {
      ...this.taskData,
      uploadType: this.taskData?.uploadType || 'Auto Trigger',
      frequency: this.taskData?.frequency || 'Daily',
      time: '01:01:01',
      startDate: this.taskData?.startDate
        ? new Date(this.taskData?.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    }
    linkTaskToWorkflow(this.taskData, this.uiTaskId, this.appService, 'start')
  }

}

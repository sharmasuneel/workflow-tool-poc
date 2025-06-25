import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepickerConfig, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AppService } from '../../services/app.service';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-start',
  standalone: true,
  imports: [FormsModule,MatDatepickerModule, CommonModule,NgbTimepickerModule, DropWrapperContainerComponent,NgbModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class StartComponent {
  uploadType:string='Auto Trigger';
  frequency:string='Daily';
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
  startDate:Date=new Date();
  date: Date = new Date();

  // task related variables
  @Input() uiTaskId: string;
  taskData: any = {};
  toastMsg: string;
  showToast:boolean = false;
  phase: string;

  //services 
  private appService = inject(AppService);

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
    } 
  }

  onSave() {
    this.taskData = {
      ...this.taskData,
      taskType: 'start',
      uiTaskId: this.uiTaskId,
      uploadType: this.taskData.uploadType || 'Auto Trigger',
      frequency: this.taskData.frequency || 'Daily',
      time: this.taskData.time || { hour: 0, minute: 0, second: 0 },
      startDate: this.taskData.startDate || new Date(),
      taskUpdatedByUserId: null,
    }
    this.appService.updateTaskById(this.uiTaskId, this.taskData)
    console.log('Start Task data updated:', this.taskData);
  }
}

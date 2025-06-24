import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropWrapperContainerComponent } from '../../common/drop-wrapper-container/drop-wrapper-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepickerConfig, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
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

  @Input() uiTaskId: string;

  constructor(timepickerConfig: NgbTimepickerConfig) {
    timepickerConfig.seconds = true;
    timepickerConfig.spinners = false;
  } 
}

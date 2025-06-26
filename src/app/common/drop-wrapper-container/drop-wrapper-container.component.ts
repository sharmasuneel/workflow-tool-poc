import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output,inject, input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
@Component({
  selector: 'app-drop-wrapper-container',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './drop-wrapper-container.component.html',
  styleUrl: './drop-wrapper-container.component.scss'
})
export class DropWrapperContainerComponent implements OnInit{

  isExpanded: boolean = true;
  @Output() save = new EventEmitter<string>();
  @Output() complete = new EventEmitter<string>();
  @Output() approve = new EventEmitter<string>();
  @Output() reject = new EventEmitter<string>();
  @Input() taskType: string="";
  phase:string;

   //services 
    private appService = inject(AppService);
  
  toggleChildren() {
    this.isExpanded = !this.isExpanded;
  }
  onSave(){
    this.save.emit();
  }
  onComplete(){
    this.complete.emit();
  }
  onApprove(){
    this.approve.emit();
  }
  onReject(){
    this.reject.emit();
  }
  ngOnInit(): void {
    //this.phase = this.appService.getPhase();
    this.phase='execution';
  }

}



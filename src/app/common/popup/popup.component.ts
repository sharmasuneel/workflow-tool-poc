import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AppService } from "app/services/app.service";
import { DataService } from "app/services/data.service";
import { PopupService } from "app/services/popup.service";
import { updateWorkflow } from "app/utils/dataSubmission";

// popup.component.ts
@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  isVisible = false;
  title = '';
  message = '';
  type = '';
  rejectComment = ''
  btns: any[];
  taskData: any
  commentary: any

  filehistory = [
    {
      businessDate: '2025-06-25',
      name: 'Quarterly_Report_Q2_2025.xlsx',
      uploadedBy: 'Ravi Mehta',
      version: 'v1.0',
      uploadDate: '2025-06-26'
    },
    {
      businessDate: '2025-06-26',
      name: 'Transaction_Log_June.csv',
      uploadedBy: 'Anjali Rao',
      version: 'v2.1',
      uploadDate: '2025-06-27'
    },
    {
      businessDate: '2025-06-27',
      name: 'Revenue_Summary_2025.pdf',
      uploadedBy: 'Devansh Iyer',
      version: 'v1.3',
      uploadDate: '2025-06-28'
    }
  ];

  private router: Router = inject(Router)
  private popupService: PopupService = inject(PopupService)
  private dataService: DataService = inject(DataService)
  private appService: AppService = inject(AppService)

  constructor() {
    this.popupService.popupState$.subscribe((params: any) => {
      if (params) {
        this.title = params.title;
        this.message = params.msg;
        this.isVisible = true;
        this.btns = params.btns
        this.type = params.type
        this.taskData = params.taskData
        this.commentary = this.getcommentaryString(params.commentary)
      } else {
        this.isVisible = false;
      }
    });
  }

  getcommentaryString(commentary: any) {
    if (Array.isArray(commentary)) {
      const dd = commentary.map((line: any, idx: number) => {
       return  `${idx + 1}. ${line?.taskType.toUpperCase()}: Status: ${line.status} ${line.commentary}`
    }).join('\n');
      debugger
      return dd
    }
    return '';


  }

  

  onApprove() {
    updateWorkflow(this.appService, this.dataService, this.taskData.uiTaskId, {...this.taskData, status: 'approved'}, this.popupService)
    this.close()
    this.router.navigate([''])
    //TODO  add approve
  }
  onReject() {
    updateWorkflow(this.appService, this.dataService, this.taskData.uiTaskId, {...this.taskData, status: 'rejected'}, this.popupService, true)
    this.close()
    this.router.navigate([''])
    //TODO  reject
  }

  goToDashboard() {
    this.close()
    this.router.navigate([''])
  }

  close() {
    this.popupService.close();
    this.isVisible = false;
  }
}

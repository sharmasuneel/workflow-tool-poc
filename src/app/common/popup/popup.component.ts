import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PopupService } from "app/services/popup.service";

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

      private router:Router =  inject(Router)
      private popupService:PopupService =  inject(PopupService)

    constructor() {
        this.popupService.popupState$.subscribe((data: any) => {
            if (data) {
                this.title = data.title;
                this.message = data.msg;
                this.isVisible = true;
                this.btns = data.btns
                this.type = data.type
            } else {
                this.isVisible = false;
            }
        });
    }

    onApprove() {
        //TODO  add approve
    }
    onReject() {
        //TODO  reject
    }

    goToDashboard() {
        this.router.navigate([''])
        this.close()
    }

    close() {
        this.popupService.close();
    }
}

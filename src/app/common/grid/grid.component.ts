// data-table.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AppService } from '../../services/app.service';

ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  template: `
    <ag-grid-angular
      style="width: 100%; height: 500px;"
      class="ag-theme-alpine"
      [rowData]="rowData"
      [columnDefs]="columnDefs">
    </ag-grid-angular>
  `
})

/* 
"workflowId": 1,
        "workflow": "Quarterly Promotions",
        "progress": 80,
        "status": { "task": "In Progress", "review": "", "approval": "" },
        "assignedTo": [
            { "name": "Chetan M", "email": "chetan.m@example.com", "id": 101 },
            { "name": "Priya S", "email": "priya.s@example.com", "id": 102 }
        ],
        "commentary": "" */
export class AppGrid implements OnInit {
  private appService = inject(AppService);
  columnDefs: ColDef[] = [
    { field: 'workflow' },
    { field: 'progress' },
    { field: 'status' },
    { field: 'assignedTo' },
    { field: 'commentary' }
  ];

  rowData: any[] = [];

  transformData = (data: any[]) => {
    return data.map(item => ({
      workflow: item.workflow,
      progress: item.progress + '%',
      status: `Task: ${item.status.task}\nReview: ${item.status.review || 'waiting approval'}\nApproval: ${item.status.approval || 'waiting approval'}`,
      assignedTo: item.assignedTo.map((user: any) => user.name).join(', '),
      commentary: item.commentary || 'No comments'
    }));
  }

  ngOnInit() {
    setTimeout(() => {
      this.rowData = this.transformData(this.appService.getWorkflows());
    }, 1000);
  }
}

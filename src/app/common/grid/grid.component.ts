// data-table.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';

ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  template: `
    <ag-grid-angular
      style="height: 500px;"
      class="ag-theme-alpine"
      [rowHeight]="80"
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

  constructor(private router: Router) { }
  columnDefs: ColDef[] = [
    {
      field: 'workflow', cellRenderer: (params: any) => {
        return `<div>
          <a class="my-action-btn">${params.getValue()}</a>
        </div>`;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.classList.contains('my-action-btn')) {
          this.router.navigate(['/workflow'], {
            queryParams: { workflowId: params.data.workflowId}});
        }
      }
    },
    { field: 'progress' },
    {
      field: 'status', cellRenderer: (params: any) => {
        const { task, review, approval } = params.getValue();
        return `<div>
          <div><strong>Task:</strong> ${task}</div>
          <div><strong>Review:</strong> ${review}</div>
          <div><strong>Approval:</strong> ${approval}</div>
        </div>`;
      },
    },
    {
      field: 'assignedTo',
      cellRenderer: (params: any) => {
        const users = params.data.assignedTo.split(',') || [];
        return `<ul style="margin:0;padding-left:16px;">
          ${users.map((user: any) => `<div>${user}</div>`).join('')}
        </ul>`;
      }
    },
    { field: 'commentary' }
  ];

  rowData: any[] = [];

  transformData = (data: any[]) => {
    return data.map(item => ({
      workflow: item.workflow,
      workflowId: item.workflowId,
      progress: item.progress + '%',
      status: {
        task: item.status.task,
        review: item.status.review || 'waiting approval',
        approval: item.status.approval || 'waiting approval'
      },
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

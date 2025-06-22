// data-table.component.ts
import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import { Input } from '@angular/core';

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
      [rowData]="filterRowData"
      [columnDefs]="columnDefs">
    </ag-grid-angular>
  `
})

export class AppGrid implements OnInit, OnChanges {
  private appService = inject(AppService);
  @Input() selectedRole: string = 'owner';

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
            queryParams: { id: params.data.workflowId, action: 'execute', type: 'workflow' }});
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
  filterRowData: any[] =[]

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
      createdBy: item.createdBy,
      assignedTo: item.assignedTo.map((user: any) => user.name).join(', '),
      commentary: item.commentary || 'No comments'
    }));
  }

  ngOnInit() {
    setTimeout(() => {
      this.rowData = this.transformData(this.appService.getWorkflows());
      this.filterDataBySelectedTab(this.selectedRole)
    }, 1000);
  }

  filterDataBySelectedTab(selectedTab: string) {
    this.filterRowData = this.rowData.filter((data: any) => data.createdBy.role === selectedTab)
  }

  ngOnChanges(changes: any): void {
    const selectedRole = changes.selectedRole
    if (selectedRole && !selectedRole.firstChange) {
      this.filterDataBySelectedTab(selectedRole.currentValue)
    }
  }

}

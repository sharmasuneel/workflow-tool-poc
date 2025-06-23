// data-table.component.ts
import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { filterDataBySelectedTab, transformData } from '../../utils/dataTransformer'

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
      [rowData]="filteredData"
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
            queryParams: { id: params.data.workflowId, action: 'execute', type: 'workflow' }
          });
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

  filteredData: any[] = []

  ngOnInit() {
    setTimeout(() => {
      this.filteredData = filterDataBySelectedTab(this.selectedRole, this.appService.getUser()?.userId, this.appService.getWorkflows(), this.appService.getUsers())
    }, 1000);
  }

  ngOnChanges(changes: any): void {
    const selectedRole = changes.selectedRole
    if (selectedRole && !selectedRole.firstChange) {
      this.filteredData = filterDataBySelectedTab(selectedRole.currentValue, this.appService.getUser().userId, this.appService.getWorkflows(), this.appService.getUsers())
    }
  }

}

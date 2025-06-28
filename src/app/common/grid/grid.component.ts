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
import getConfig from '../../config';
import { DataService } from '../../services/data.service';
import { workflowsData } from '../../stub/staticdata'
import { PopupService } from "../../services/popup.service";

ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  styleUrls: ['./grid.component.scss'],
  template: `<div  class="ag-theme-alpine">
    <ag-grid-angular
      style="height: 500px;"
      [rowHeight]="80"
      [rowData]="filteredData"
      [columnDefs]="columnDefs"
      [localeText]="{ noRowsToShow: 'No workflow to show' }">
    </ag-grid-angular></div>
  `
})
export class AppGrid implements OnInit, OnChanges {
  private appService = inject(AppService);
  private dataService = inject(DataService);
  private popupService = inject(PopupService);
  @Input() selectedRole: string = 'owner';

  constructor(private router: Router) { }
  columnDefs: ColDef[] = [
    {
      field: 'workflowName',
      width: 200,
      cellRenderer: (params: any) => {
        return `<div>
          <a class="my-action-btn">${params.getValue()}</a>
        </div>`;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.classList.contains('my-action-btn')) {
          this.appService.setPhase('execution')
          this.appService.setWorkflowId(params.data.workflowId)
          this.router.navigate(['/workflow'], {
            queryParams: { id: params.data.workflowId, action: 'execute', type: 'workflow', selectedRole: this.selectedRole }
          });
        }
      }
    },
    {
      field: 'progress',
      width: 150
    },
    {
      field: 'status',
      width: 450,
      cellRenderer: (params: any) => {
        const { task, review, approval } = params.getValue();
        return `<div class="status-container">
          <div class="status-icon">
            <img src="/assets/icons/Status.png" alt="Status Icon" />
          </div>
          <div class="status-details">
            <p><span>Task:</span> <span class="status-text in-progress">${task}</span></p>
            <p><span>Review:</span> <span class="status-text ">${review}</span></p>
            <p><span>Approval:</span> <span class="status-text ">${approval}</span></p>
          </div>
        </div>`;
      }
    },
    {
      field: 'assignedTo',
      width: 250,
      cellRenderer: (params: any) => {
        const users = params.data.assignedTo.split(',') || [];
        return `<div class="d-flex align-item-center">
          <img src="/assets/icons/User Profile.png" />
          <ul class="status-details" style="margin:0;padding-left:16px;">
            ${users.map((user: any) => `<p>${user}</p>`).join('')}
          </ul>
        </div>`;
      }
    },
    {
      field: 'commentary',
      width: 200,
      cellRenderer: (params: any) => {
        return `<div>
        <img class="commentry" src="/assets/icons/Commentary.png" />
        <img src="/assets/icons/Audit Trail.png" />
        </div>`;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.classList.contains('commentary')) {
          this.popupService.open({
            title: 'Conversation', msg: 'Are you sure you want to reject this file. Please add a comment to justify your action.',
            type: 'commentary',
          });
        }
      }
    }
  ];

  filteredData: any[] = []
  workflows: any[] = []

  ngOnInit() {
    if (getConfig().st) {
      this.workflows = workflowsData;
      this.appService.setWorkflows(workflowsData);
      this.filteredData = filterDataBySelectedTab(this.selectedRole, this.appService.getUser()?.role, workflowsData, this.appService.getUsers())
    } else {
      setTimeout(() => {
        this.dataService.getData(getConfig().workflows).subscribe((data: any) => {
          this.workflows = data;
          this.appService.setWorkflows(data);
          this.filteredData = filterDataBySelectedTab(this.selectedRole, this.appService.getUser()?.role, data, this.appService.getUsers())
        });
      }, 100);
    }
  }

  ngOnChanges(changes: any): void {
    const selectedRole = changes.selectedRole
    if (selectedRole && !selectedRole.firstChange) {
      this.filteredData = filterDataBySelectedTab(selectedRole.currentValue.role, this.appService.getUser().role, this.appService.getWorkflows(), this.appService.getUsers())
    }
  }

}

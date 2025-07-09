import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AppService } from "app/services/app.service";
import { gridColumns } from "app/utils/gridProperties";
import { Router } from "@angular/router";
import { UserBannerComponent } from "../../components/common/user-banner/user-banner.component";
import { HeaderComponent } from "../../components/common/header/header.component";
import { GridHeaderComponent } from "../../components/common/grid/grid-header/grid-header.component";
ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [UserBannerComponent, CommonModule, FormsModule, HeaderComponent, AgGridAngular,GridHeaderComponent],
  templateUrl: './taskDashboard.component.html',
  styleUrl: './taskDashboard.component.scss'
})
export class TaskDashboardComponent implements OnInit {
  profileSelected: any;
  selectedTab: string = 'active';
  completedCount: number = 0;
  upcomingCount: number = 0;
  activeCount: number = 0;
  filteredData: any = [];
  paginationPageSize = 5;
  @Output() selectedRoleChange = new EventEmitter<string>();

  selectedRole: any = 'owner'
  showCreateWorkflowBtn: boolean = true;

  private appService = inject(AppService);

  columnDefs: ColDef[];
  columnDefs1: ColDef[] =
    [
      {
        headerName: 'Workflow Name',
        field: 'workflowname',
        width: 250,
        cellRenderer: (params: any) => {

          return `<div>
        ${params.getValue()}
       </div>`;
        }
      },
      {
        headerName: 'Task Name',
        field: 'taskName',
        width: 200,
        cellRenderer: (params: any) => {

          return `<div>
         ${params.getValue()}
        </div>`;
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 150,
        cellRenderer: (params: any) => {

          return `<div>
         ${params.getValue()}
        </div>`; return ``;
        }
      },
      {
        headerName: 'Actions',
        field: 'action',
        width: 150,
        cellRenderer: (params: any) => {

          return `
        <div class="d-flex align-items-center">	
          <button class="btn btn-primary">Select</button
        </div>
        `;
        }
      },
      {
        headerName: 'Due By',
        field: 'dueby',
        width: 150,
        cellRenderer: (params: any) => {

          return `<div>
         ${params.getValue()}
        </div>`;
        }
      },
    ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredData = this.appService.getUserTasks();
    
    this.columnDefs = gridColumns('task', this.filteredData, { router: this.router, setPhase: this.appService.setPhase, setWorkflowId: this.appService.setWorkflowId,gridHeaderComponent:'app-grid-header' })
    console.log('filteredData: > ', this.filteredData);

  };
  filterWorkFlows(evt: any): void {
    this.selectedRole = evt
    this.showCreateWorkflowBtn = evt === 'owner' || evt.role === 'owner'
    this.profileSelected = evt
  }
}

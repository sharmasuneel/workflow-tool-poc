import { Component, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Router } from "@angular/router";
import { DataService, PopupService, AppService } from "@services";
import { gridColumns } from "@utils/gridProperties";
import getConfig from "@config";
import { flattenData } from "@utils/dataTransformer";
import { ExtraAttribute } from "@interfaces/extraAttributes.model";
ModuleRegistry.registerModules([AllCommunityModule]);


@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './taskDashboard.component.html',
  styleUrl: './taskDashboard.component.scss'
})
export class TaskDashboardComponent implements OnInit {
  profileSelected: any;
  selectedTab: string = 'pending';
  completedCount: number = 0;
  upcomingCount: number = 0;
  activeCount: number = 0;
  filteredData: any = [];
  paginationPageSize = 5;
  @Output() selectedRoleChange = new EventEmitter<string>();

  selectedRole: any = 'owner'
  showCreateWorkflowBtn: boolean = true;

  private appService = inject(AppService);
  private dataService = inject(DataService);
  private popupService = inject(PopupService);
  private router = inject(Router);

  columnDefs: ColDef[];

  ngOnInit(): void {
    this.resetFilterDataByTab()
  };

  resetFilterDataByTab() {
    const data = this.appService.getUserTasks()
    const extraAttributes: ExtraAttribute[] = [{ attr: 'taskEndDateSignal', func: { name: "getSignalClass", params: ['task_taskEndDate', 'task_taskStatus'] } }];
    
    this.filteredData = flattenData(data.filter((item: any) => {
      if (this.selectedTab === 'pending' && (item.task.taskStatus === 'pending' || item.task.taskStatus === 'inProgress')) {
        return true;
      } else {
        return this.selectedTab === item.task.taskStatus;
      }

    }), extraAttributes);
    const columnDefs = gridColumns('task', this.filteredData, {
      router: this.router,
      setPhase: this.appService.setPhase,
      setWorkflowId: this.appService.setWorkflowId,
      postData: (url: string, payload: any, headers: any, onSuccess: any, onFailure: any) => this.handlePostData(url, payload, headers, onSuccess, onFailure),
      getData: (url: string, headers: any) => this.handleGetData(url, headers)
    })
    this.columnDefs = this.selectedTab === 'completed' ? columnDefs.filter((cd: any) => cd.field !== 'action') : columnDefs
  }

  setSelectedTab(tab: string) {
    this.selectedTab = tab
    this.resetFilterDataByTab()
  }

  handleGetData(url: string, headers: any) {
    // handle get api here 
  }

  refreshTasks() {
    this.dataService.getData(getConfig().userTasks).subscribe((data) => {
      this.appService.setUserTasks(data);
      this.resetFilterDataByTab()
    });
  }

  handlePostData(url: string, payload: any, headers: any, onSuccess: any, onFailure: any) {
    this.dataService.postData(url, payload, headers).subscribe({
      next: (data: any) => {
        const { message, title, type } = onSuccess
        this.popupService.open({ isVisible: true, title, type, message });
        this.refreshTasks()
      }, error: () => {
        const { message, title, type } = onFailure
        this.popupService.open({ isVisible: true, title, type: 'error', message });
        this.refreshTasks()
      }

    })
  }
}

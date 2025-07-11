import { Component, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { gridColumns } from "app/utils/gridProperties";
import { Router } from "@angular/router";
import { DataService, PopupService, AppService } from "../../services";
import getConfig from "app/config";
import { flattenData } from "app/utils/dataTransformer";
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
    const extraAttributes = { attr: 'taskEndDateSignal', func: "getSignalClass", params: { param1: "task_taskEndDate" } };
    this.filteredData = flattenData(data.filter((item: any) => item.task.taskStatus === this.selectedTab), extraAttributes);
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
    this.dataService.postData(url, payload).subscribe({
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

  filterWorkFlows(evt: any): void {
    this.selectedRole = evt
    this.showCreateWorkflowBtn = evt === 'owner' || evt.role === 'owner'
    this.profileSelected = evt
  }
}

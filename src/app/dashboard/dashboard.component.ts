import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { AppGrid } from "../common/grid/grid.component";
import { UserBannerComponent } from '../user-banner/user-banner.component';
import { AppService } from "../services/app.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService } from "../services/data.service";
import getConfig from "../config";
import { toFormData } from '../utils/dataTransformer'
import { Router } from '@angular/router';
import { HeaderComponent } from "app/header/header.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [AppGrid, UserBannerComponent, CommonModule, FormsModule, HeaderComponent],
  styleUrls: ['./dashboard.component.scss'],
  standalone: true
})


export class DashboardComponent {
  title: string;
  data: any[];
  profileSelected: any
  private appService = inject(AppService);
  private dataService = inject(DataService);


  constructor(private router: Router) {
    this.title = 'Dashboard';
    this.data = [];
  }

  @Output() selectedRoleChange = new EventEmitter<string>();

  selectedRole: any = 'owner'
  loggedInUser: any
  users: any[] = [];

  ngOnInit() {
    this.loggedInUser = this.appService.getUser()

    if (!this.loggedInUser) {
      this.router.navigate([''])
    }
    this.users = this.appService.getUsers();
  }
  ngOnChanges(changes: any) {
    if (changes.selectedRole && !changes.selectedRole.firstChange) {
      // selectedRole has changed
      // Add your logic here if needed
      debugger
    }
  }

  showCreateWorkflow: boolean = false
  showCreateWorkflowBtn: boolean = true
  newWorkflowName: string

  createNewWorkFlow() {
    this.appService.initiateWorkFlow({ workflowName: this.newWorkflowName })

    this.appService.setWorkflowName(this.newWorkflowName)
    this.appService.setPhase('creation')
    this.router.navigate(['/workflow'], { queryParams: { action: 'create', name: this.newWorkflowName, selectedRole: this.selectedRole, workflowType: 'new' } });
  }

  filterWorkFlows(evt: any): void {
    this.selectedRole = evt
    this.showCreateWorkflowBtn = evt === 'owner' || evt.role === 'owner'
    this.profileSelected = evt
  }
  
}
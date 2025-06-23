import { Component, EventEmitter, inject, Output } from "@angular/core";
import { AppGrid } from "../common/grid/grid.component";
import { UserBannerComponent } from '../user-banner/user-banner.component';
import { AppService } from "../services/app.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService } from "../services/data.service";
import getConfig from "../config";
import { toFormData } from '../utils/dataTransformer'
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [AppGrid, UserBannerComponent, CommonModule, FormsModule],
  styleUrls: ['./dashboard.component.scss'],
  standalone: true
})


export class DashboardComponent {
  title: string;
  data: any[];
  private appService = inject(AppService);
  private dataService = inject(DataService);

  constructor(private router: Router) {
    this.title = 'Dashboard';
    this.data = [];
  }

  @Output() selectedRoleChange = new EventEmitter<string>();
  selectedRole: string ='owner'
  loggedInUser: any 
  users: any[] = [];
  ngOnInit() {
    this.loggedInUser = this.appService.getUser()

    if(!this.loggedInUser) {
      this.router.navigate([''])
    }
    setTimeout(() => {
      this.users = this.appService.getUsers();
      console.log('Users loaded:', this.users);
    }, 1000);
  }

  showCreateWorkflow: boolean = false
  showCreateWorkflowBtn: boolean= true

  createNewWorkFlow() {
    const data: any = {
      workflowName: this.newWorkflowName,
      createdBy: this.users[0].users[0].userId
    }

    const formData = toFormData({ 'metadata': JSON.stringify(data) })
    this.dataService.postData(getConfig().saveWorkflow, formData).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
      this.appService.setWorkflowId(response.workflowId)
      this.appService.setWorkflowName(this.newWorkflowName)
      this.router.navigate(['/workflow'], { queryParams: { id: response.workflowId, action: 'create', name: this.newWorkflowName} });
    })
  }
  newWorkflowName: string

  onUserInteraction(event: any) {
    console.log('User interacted with:', event);
  }

  filterWorkFlows(evt: any): void {
    this.selectedRole = evt
    this.showCreateWorkflowBtn =  evt === 'owner'
  }
}
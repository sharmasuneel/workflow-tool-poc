import { Component, inject } from "@angular/core";
import { AppGrid } from "../common/grid/grid.component";
import { HeaderComponent } from '../header/header.component';
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
  users: any[] = [];
  ngOnInit() {
    setTimeout(() => {
      this.users = this.appService.getUsers();
      console.log('Users loaded:', this.users);
    }, 1000);
  }

  showCreateWorkflow: boolean = false

  createNewWorkFlow() {
    const data: any = {
      worflowName: this.newWorkflowName,
      user: this.users[0].users[0]
    }

    const formData = toFormData({ 'metadata': JSON.stringify(data) })
    this.dataService.postData(getConfig().saveWorkflow, formData).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
      this.appService.setWorkflowId(response.workflowId)
      this.appService.setWorkflowName(this.newWorkflowName)
      this.router.navigate([`/workflow?id=${response.workflowId}`]);
    })

  }
  newWorkflowName: string

  onUserInteraction(event: any) {
    // Handle user interactions
    console.log('User interacted with:', event);
  }
}
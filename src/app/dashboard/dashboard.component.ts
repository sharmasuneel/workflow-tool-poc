import { Component, inject } from "@angular/core";
import { AppGrid } from "../common/grid/grid.component";
import { HeaderComponent } from '../header/header.component';
import { UserBannerComponent } from '../user-banner/user-banner.component';
import { AppService } from "../services/app.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService } from "../services/data.service";
import getConfig from "../config";

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

  constructor() {
    this.title = 'Dashboard';
    this.data = [];
  }
  users: any[] = [];
  ngOnInit() {
    setTimeout(() => {
      this.users = this.appService.getUsers();
      console.log('Users loaded:', this.users);
    }, 1000);
    this.loadData();
  }

  showCreateWorkflow: boolean = false

  toFormData(obj: any): FormData {
    const formData = new FormData();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }
    return formData;
  }

  createNewWorkFlow() {

    const data: any = {
      worflowName: this.newWorkflowName,
      user: this.users[0].users[0]
    }

    const formData =  this.toFormData({'metadata': JSON.stringify(JSON.stringify(data))})
    this.dataService.postData(getConfig().saveWorkflow, formData).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
    })

  }
  newWorkflowName: string

  loadData() {
    // Logic to load data for the dashboard
    this.data = [
      // Sample data
      { id: 1, name: 'Item 1', value: 100 },
      { id: 2, name: 'Item 2', value: 200 },
      { id: 3, name: 'Item 3', value: 300 }
    ];
  }

  onUserInteraction(event: any) {
    // Handle user interactions
    console.log('User interacted with:', event);
  }
}
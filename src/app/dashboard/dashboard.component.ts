import { Component, inject } from "@angular/core";
import { AppGrid } from "../common/grid/grid.component";
import { HeaderComponent } from '../header/header.component';
import { UserBannerComponent } from '../user-banner/user-banner.component';
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [AppGrid, HeaderComponent, UserBannerComponent],
  styleUrls: ['./dashboard.component.scss'],
  standalone: true
})
export class DashboardComponent {
  title: string;
  data: any[];
  private userService = inject(UserService);

  constructor() {
    this.title = 'Dashboard';
    this.data = [];
  }
  users: any[] = [];
  ngOnInit() {
    setTimeout(() => {
      this.users = this.userService.getUsers();
      console.log('Users loaded:', this.users);
    }, 1000);
    this.loadData();
  }

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
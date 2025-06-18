import { Component } from "@angular/core";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true
})
export class DashboardComponent {
  title: string;
  data: any[];

  constructor() {
    this.title = 'Dashboard';
    this.data = [];
  }

  ngOnInit() {
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
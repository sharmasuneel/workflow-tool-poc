import { Component } from '@angular/core';

@Component({
  selector: 'app-user-banner',
  templateUrl: './user-banner.component.html',
  styleUrls: ['./user-banner.component.css']
})
export class UserBannerComponent {
  roles = [
    { name: 'Owner', count: 12, label: 'Created Workflows' },
    { name: 'Preparator', count: 2, label: 'Pending Tasks' },
    { name: 'Pending Reviews' },
    { name: 'Approver', count: 21, label: 'Pending Approvals' }
  ];
}

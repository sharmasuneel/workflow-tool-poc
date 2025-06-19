import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-banner',
  templateUrl: './user-banner.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./user-banner.component.scss']
})
export class UserBannerComponent {
  roles = [
    { name: 'Owner', count: 12, label: 'Created Workflows' },
    { name: 'Preparator', count: 2, label: 'Pending Tasks' },
    { name: 'Pending Reviews' },
    { name: 'Approver', count: 21, label: 'Pending Approvals' }
  ];
}

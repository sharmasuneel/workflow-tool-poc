import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-user-banner',
  templateUrl: './user-banner.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./user-banner.component.scss']
})
export class UserBannerComponent implements OnInit {
  roles = [
    { name: 'Owner', count: 12, label: 'Created Workflows', role: 'owner' },
    { name: 'Preparator', count: 2, label: 'Pending Tasks', role: 'preparator' },
    { name: 'Reviewer', role: 'reviewer', count: 2, label: 'Pending Tasks' },
    { name: 'Approver', count: 21, label: 'Pending Approvals', role: 'approver' }
  ];

  private appService = inject(AppService);
  @Output() roleSelected = new EventEmitter<string>();

  ngOnInit() {
    this.setWorflowCountByRole()
  }
  
  getCount(role: string) {
    const data =  this.appService.getWorkflows()
    return data.filter((workflow: any) => workflow.createdBy.role === role).length
  }

  setWorflowCountByRole() {
    this.roles = this.roles.map((item) => {
      const d = {...item, count: this.getCount(item.role)}
      debugger;
      return d
    })
  }

  onCardClick(tab: any) {
    this.roleSelected.emit(tab.role);
    this.appService.setFilter({selectedRole: tab})
  }
}

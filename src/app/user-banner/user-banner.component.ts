import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app.service';
import { filterDataBySelectedTab, transformData } from '../utils/dataTransformer';

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
  activeRole:string = '';


  private appService = inject(AppService);
  @Output() roleSelected = new EventEmitter<string>();

  ngOnInit() {
    this.setWorflowCountByRole()
  }
  
  getCount(role: string) {
    const filteredData = filterDataBySelectedTab(role, this.appService.getUser()?.userId, this.appService.getWorkflows(), this.appService.getUsers())
    return filteredData.filter((workflow: any) => workflow.myRole === role).length
  }

  setWorflowCountByRole() {
    this.roles = this.roles.map((item) => {
      return {...item, count: this.getCount(item.role)}
    })
  }

  onCardClick(tab: any) {
    this.roleSelected.emit(tab.role);
    this.appService.setFilter({selectedRole: tab});
    this.activeRole = tab.role;
  }
}

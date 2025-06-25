import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
    { name: 'Owner', count: '', label: 'Created Workflows', role: 'owner' },
    { name: 'Preparator', count: '', label: 'Pending Tasks', role: 'preparator' },
    { name: 'Reviewer', role: 'reviewer', count: '', label: 'Pending Tasks' },
    { name: 'Approver', count: '', label: 'Pending Approvals', role: 'approver' }
  ];

  activeRole:string = 'owner';

  private appService = inject(AppService);
  @Output() roleSelected = new EventEmitter<string>();
  @Input() profileSelected: string = 'owner'

  ngOnChanges(changes: any) {
    if (changes.profileSelected && changes.profileSelected.currentValue !== changes.profileSelected.previousValue) {
      const selectedRole = this.roles.find(role => role.role === changes.profileSelected.currentValue.role);
      if (selectedRole) {
        // TODO: in case change profile set tab 
        // this.onCardClick(selectedRole);
        this.setWorflowCountByRole()
      }
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.setWorflowCountByRole()
    }, 1000);
  }
  
  getCount(role: string) {
    const filteredData = filterDataBySelectedTab(role, this.appService.getUser()?.userId, this.appService.getWorkflows(), this.appService.getUsers())
    return filteredData.filter((workflow: any) => workflow.myRole === role).length
  }

  setWorflowCountByRole() {
    this.roles = this.roles.map((item) => {
      return {...item, count: this.getCount(item.role).toString()}
    })
  }

  onCardClick(tab: any) {
    this.roleSelected.emit(tab.role);
    this.appService.setFilter({selectedRole: tab});
    this.activeRole = tab.role;
  }

}

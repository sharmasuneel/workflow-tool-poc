import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DataService } from './services/data.service';
import { AppService } from './services/app.service';
import getConfig from './config';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './common/login/login.component';
import { usersData, workflowsData } from './stub/staticdata'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'drawflowangular';
  workflows: any[] = [];


  private dataService = inject(DataService);
  private appService = inject(AppService);

  users: any = {
    owner: { "userId": 1, "name": "Owner", "role": "owner" },
    preparator: { "userId": 2, "name": "Preparator", "role": "preparator" },
    reviewer: { "userId": 3, "name": "Reviewer", "role": "reviewer" },
    approver: { "userId": 4, "name": "Approver", "role": "approver" }
  }

  private urls = getConfig()
  ngOnInit() {
    this.appService.setUsers(this.users);
    if (this.urls.st) {
      this.workflows = workflowsData;
      this.appService.setWorkflows(workflowsData);
    } else {
      this.dataService.getData(this.urls.workflows).subscribe((data) => {
        this.workflows = data;
        this.appService.setWorkflows(data);
      });
    }
  }
}



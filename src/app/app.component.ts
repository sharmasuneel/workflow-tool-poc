import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DataService } from './services/data.service';
import { User } from 'lucide';
import { AppService } from './services/app.service';
import getConfig from './config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'drawflowangular';
  users: any[] = [];
  workflows: any[] = [];

  private dataService = inject(DataService);
  private appService = inject(AppService);

  private urls = getConfig()


   ngOnInit() {
    this.dataService.getData(this.urls.users).subscribe((data) => {
      this.users = data;
      this.appService.setUsers(data );
    });
    this.dataService.getData(this.urls.workflows).subscribe((data) => {
      this.workflows = data;
      this.appService.setWorkflows(data );
    });
  }
}



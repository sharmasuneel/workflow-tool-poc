// Angular Core & Common Modules
import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

// Application Services
import { DataService, AppService } from '@services';

// Application Components
import { HeaderComponent, PopupComponent } from '@components/common';

// Application Utilities & Config
import getConfig from './config';
import { workflowsData } from './stub/staticdata';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, PopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'drawflowangular';
  workflows: any[] = [];
  userTasks: any[] = [];


  private dataService = inject(DataService);
  private appService = inject(AppService);

  users: any = {
    owner: { "userId": 1, "name": "Owner", "role": "owner" },
    preparator: { "userId": 2, "name": "Preparator", "role": "preparator" },
    reviewer: { "userId": 3, "name": "Reviewer", "role": "reviewer" },
    approver: { "userId": 4, "name": "Approver", "role": "approver" }
  }

  private urls = getConfig()
  constructor(@Inject(DOCUMENT) private document: Document, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Document Workflow Management');
    this.changeFavicon('../assets/icons/logo.png');
    this.appService.setUsers(this.users);

    this.dataService.getData(this.urls.userTasks).subscribe((data) => {
      this.appService.setUserTasks(data);
    });

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
  changeFavicon(newFaviconPath: any): void {
    const faviconLink = this.document.getElementById('appFavicon') as HTMLLinkElement;
    if (faviconLink) {
      faviconLink.href = newFaviconPath;
    }
  }
}



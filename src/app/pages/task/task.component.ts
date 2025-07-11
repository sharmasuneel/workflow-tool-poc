import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopupService } from 'app/services/popup.service';

@Component({
  selector: 'page-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  tasks: string[] = [];
  task: any={};
  taskType: string;
  profileSelected: any;
   private popupService=inject(PopupService);

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.task = navigation?.extras?.state;
  }

  ngOnInit(): void {
    this.taskType = this.route.snapshot.paramMap.get('taskType') || 'route id missing';

  }

 

  goToDashboard() {
    this.router.navigate(['/tasks']);
  }
  openFileVersionPopup(data: any) {
    this.popupService.open({
      title: 'File Version', taskBusinessName: data.taskBusinessName,
      type: 'fileversion',
      fileVersions: data.file.versions

    });
  }
  openFileHistoryPopup(data: any) {
    this.popupService.open({
      title: 'File History', taskBusinessName: data.taskBusinessName,
      type: 'filehistory',
      fileVersions: data.file.versions

    });
  }
  openQueryPopup() {
    this.popupService.open({
      title: 'Chat',
      type: 'query',


    });
  }
}
 

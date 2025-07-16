import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopupService } from 'app/services/popup.service';
import getConfig from 'app/config';

@Component({
  selector: 'page-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  tasks: string[] = [];
  task: any = {};
  taskType: string;
  profileSelected: any;
  downloadUrl: string = getConfig().downlodFile;
  private popupService = inject(PopupService);

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
  removeFile(taskSectionIndex: number,fileIndex:number) {
    this.task.task_sections[taskSectionIndex].files.splice(fileIndex, 1);
  }
  onFileSelected(event: Event,taskSectionIndex:number): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.task.task_sections[taskSectionIndex].files.push(...Array.from(input.files));
    }
  }
  openFileVersionPopup(taskBusinessName:string,fileVersions:any) {
    this.popupService.open({
      title: 'File Version', taskBusinessName: taskBusinessName,
      type: 'fileversion',
      fileVersions: fileVersions

    });
  }
  openFileHistoryPopup(taskBusinessName:string,fileHistory:any) {
    this.popupService.open({
      title: 'File History', taskBusinessName: taskBusinessName,
      type: 'filehistory',
      fileVersions: fileHistory

    });
  }
  
  openQueryPopup() {
    this.popupService.open({
      title: 'Chat',
      type: 'query',
      taskQuery:this.task.task_taskQuery,
      taskQueryStatus:this.task.task_taskQueryStatus,
      taskQueries:this.task.task_taskQueries

    });
  }
}


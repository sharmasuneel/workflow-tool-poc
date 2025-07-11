import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'page-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {
  tasks: string[] = [];
  taskType: string

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.taskType = this.route.snapshot.paramMap.get('taskType') || 'route id missing';
  }

  onSelect() {
    debugger
  }

  onReject() {
    debugger
  }

}

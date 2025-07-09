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
  id: string

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id') || 'route id missing';
  }

}

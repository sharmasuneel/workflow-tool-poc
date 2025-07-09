import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import getConfig from 'app/config';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'notification-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule],
  templateUrl: './notification-management.component.html',
  styleUrl: './notification-management.component.scss'
})
export class NotificationManagementComponent implements OnInit {

  phase: string

  @Input() taskData: any
  
  downloadUrl: string = getConfig().downlodFile;


  private appService = inject(AppService)

  ngOnInit() {
    this.phase = this.appService.getPhase()
  }


}

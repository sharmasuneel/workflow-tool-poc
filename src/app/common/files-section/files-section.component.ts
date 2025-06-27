import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import getConfig from 'app/config';
import { AppService } from 'app/services/app.service';

@Component({
  selector: 'files-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './files-section.component.html',
  styleUrl: './files-section.component.scss'
})
export class FilesSectionComponent implements OnInit {

  phase: string

  @Input() taskData: any
  
  downloadUrl: string = getConfig().downlodFile;


  private appService = inject(AppService)

  ngOnInit() {
    this.phase = this.appService.getPhase()
  }

    openFile(evt: MouseEvent, taskfile: any) {
    evt.preventDefault();
    evt.stopPropagation();
    const fileUrl = this.taskData.fileUrl;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      console.error('No file URL provided');
    }

  }

}

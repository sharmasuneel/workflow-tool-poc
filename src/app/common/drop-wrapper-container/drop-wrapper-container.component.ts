import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drop-wrapper-container',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './drop-wrapper-container.component.html',
  styleUrl: './drop-wrapper-container.component.scss'
})
export class DropWrapperContainerComponent {

  isExpanded: boolean = true;

  toggleDownload() {
    this.isExpanded = !this.isExpanded;
  }

}

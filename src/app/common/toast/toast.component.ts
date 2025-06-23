import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  showToast: boolean = false
  toastMsg: string = 'Workflow saved successfully'

  private appService = inject(AppService)

  constructor(private router: Router) {}

  goToDashboard() {
    this.appService.getUser().userId
    this.router.navigate(['/dashboard'], {queryParams: {user: this.appService.getUser().userId, reload: true}})
  }

}

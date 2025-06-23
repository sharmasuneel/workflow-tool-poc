import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  showSuccessWithTimeout(message: string, title: string, timespan: number): void {
    this.toastr.success(message, title, {
      timeOut: timespan
    });
  }

  showHTMLMessage(message: string, title?: string): void {
    this.toastr.success(message, title, {
      enableHtml: true
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toastr-demo',
  standalone: true,
  template: ''
  /* <div style="position: 'absolute'; top: '0px; right: '10px"></div>
    <button (click)="showSuccess()">Show Success</button>
    <button (click)="showError()">Show Error</button>
  ` */
})
export class ToastrComponent implements OnInit {
  constructor(private toastr: ToastrService) {}
  ngOnInit() {
    this.toastr.toastrConfig.positionClass = 'toast-top-center';
  }
  public showSuccess(msg: string) {
    this.toastr.success(msg || 'Operation Successful!', '', {
      timeOut: 0,
      progressBar: false,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr custom-toast rounded-toast cust-toast'
    });
  }

  public showError(msg: string) {
    this.toastr.error(msg || 'Something went wrong.', 'Error', {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
      progressBar: false,
      tapToDismiss: false
    });
  }
}

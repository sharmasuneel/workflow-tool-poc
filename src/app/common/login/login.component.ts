import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private appService = inject(AppService);

  allUsers: any[] = [];
  selectedUser: any

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      const groups = this.appService.getUsers();
      this.allUsers = [];
      groups.forEach((group: any) => {
        if (Array.isArray(group.users)) {
          this.allUsers.push(...group.users);
        }
      });
    }, 1000);
  }

  login() {
    this.appService.setUser(this.selectedUser)
    this.router.navigate([''], {queryParams: {user: this.selectedUser.userId}});
  }
}

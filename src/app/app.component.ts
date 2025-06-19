import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DataService } from './services/data.service';
import { User } from 'lucide';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'drawflowangular';
  users: any[] = [];

  private dataService = inject(DataService);
  private userService = inject(UserService);

   ngOnInit() {
    const userUrl = 'http://localhost:3020/users';
    this.dataService.getData(userUrl).subscribe((data) => {
      this.users = data;
      this.userService.setUsers(data);
    });
  }
}



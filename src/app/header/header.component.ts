import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from '../services/app.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';




@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public appService = inject(AppService);
  @Output() profileSelected = new EventEmitter<any>();

  greetMsg: string;
  today: string

  constructor(private router: Router) {
    this.today = new Date().toLocaleDateString();
  }

  logout() {
    this.router.navigate([''])
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  menuOpen = false;

  users: any = {
    owner: { "userId": 1, "name": "Owner", "role": "owner" },
    preparator: { "userId": 2, "name": "Preparator", "role": "preparator" },
    reviewer: { "userId": 3, "name": "Reviewer", "role": "reviewer" },
    approver: { "userId": 4, "name": "Approver", "role": "approver" }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  selectRole(role: any) {
    console.log('Selected Role:', role);
    this.profileSelected.emit(role);
    this.appService.setUser(role);
    this.menuOpen = false;
    this.router.navigate([''], {
      queryParams: { selectedRole: role.role }
    });
    // You can emit this role or handle it as needed
  }


  ngOnInit(): void {
    this.greetMsg = this.getGreeting()
  }

  onNavClick(ev: Event, route: string) {
    this.router.navigate([route])
    ev.preventDefault()
  }
}

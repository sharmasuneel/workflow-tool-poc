import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from '../services/app.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {  

  public appService = inject(AppService);

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

  ngOnInit(): void {
    this.greetMsg = this.getGreeting()
  }

  onNavClick(ev: Event, route: string) {
    this.router.navigate([route])
    ev.preventDefault()
  }



}

import { Component } from '@angular/core';
import { UserDetailsService } from '../services/user-details.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showPortfolio = false;
  user = {
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    mobileNumber: '',
    image: ''
  };

  constructor(private userService: UserDetailsService, private router: Router) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }
  openPortfolio() {
    this.showPortfolio = true;
  }

  closePortfolio() {
    this.showPortfolio = false;
  }

  setDefaultImage(event: Event) {
    // (event.target as HTMLImageElement).src = 'assets/default-user.png';
  }


  logout() {
    localStorage.removeItem('user');
    this.userService.setUser(null);
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private userData: any;

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) this.userData = JSON.parse(savedUser);
  }
  setUser(data: any) {
    this.userData = data;
  }

  getUser() {
    return this.userData;
  }
}

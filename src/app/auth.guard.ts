import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserDetailsService } from '../app/services/user-details.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserDetailsService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.userService.getUser() || JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      return true; // ✅ User is logged in
    } else {
      this.router.navigate(['/login']); // ❌ Redirect to login
      return false;
    }
  }

}

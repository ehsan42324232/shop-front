import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreOwnerGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkStoreOwner(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  private checkStoreOwner(url: string): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: url } 
          });
          return of(false);
        }

        // Check if user is a store owner
        return this.authService.currentUser$.pipe(
          take(1),
          map(user => {
            if (user?.is_store_owner) {
              return true;
            } else {
              // Redirect to store request page if not a store owner
              this.router.navigate(['/auth/request-store']);
              return false;
            }
          })
        );
      })
    );
  }
}

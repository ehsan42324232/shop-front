import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Platform Components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PlatformHomeComponent } from './components/platform/platform-home/platform-home.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';

const routes: Routes = [
  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Platform routes (for store owners)
  { path: '', component: PlatformHomeComponent },
  { path: 'home', component: PlatformHomeComponent },
  
  // Store Management (protected routes)
  { 
    path: 'store-management', 
    component: StoreManagementComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Lazy loaded modules for platform features
  { 
    path: 'my-store', 
    loadChildren: () => import('./modules/store-management/store-management.module').then(m => m.StoreManagementModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'products', 
    loadChildren: () => import('./modules/product-management/product-management.module').then(m => m.ProductManagementModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders', 
    loadChildren: () => import('./modules/order-management/order-management.module').then(m => m.OrderManagementModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'analytics', 
    loadChildren: () => import('./modules/analytics/analytics.module').then(m => m.AnalyticsModule), 
    canActivate: [AuthGuard] 
  },
  
  // Platform admin routes (separate from store management)
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/platform-admin/platform-admin.module').then(m => m.PlatformAdminModule), 
    canActivate: [AuthGuard] 
  },
  
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

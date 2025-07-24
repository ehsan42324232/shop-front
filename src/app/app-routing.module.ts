import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Platform Components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { OtpLoginComponent } from './components/otp-login/otp-login.component';
import { PlatformHomeComponent } from './components/platform/platform-home/platform-home.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { ProductManagementComponent } from './components/product/product-management.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MallHomepageComponent } from './pages/mall-homepage/mall-homepage.component';

const routes: Routes = [
  // Public homepage route - Mall Platform Landing Page
  { path: '', component: MallHomepageComponent },
  { path: 'home', component: MallHomepageComponent },
  
  // Original homepage (for reference)
  { path: 'homepage', component: HomepageComponent },
  
  // Auth routes - all using OTP authentication as per requirement
  { 
    path: 'auth',
    children: [
      { path: 'login', component: OtpLoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: 'login', redirectTo: 'auth/login' },
  { path: 'otp-login', redirectTo: 'auth/login' },
  { path: 'register', redirectTo: 'auth/register' },
  
  // Dashboard - main entry point for authenticated users
  { 
    path: 'dashboard', 
    component: PlatformHomeComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Platform routes (for store owners)
  { path: 'platform', redirectTo: 'dashboard', pathMatch: 'full' },
  
  // Store Management Dashboard (main dashboard for store owners)
  { 
    path: 'store-management', 
    component: StoreManagementComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Product Management (comprehensive product hierarchy management)
  { 
    path: 'product-management', 
    component: ProductManagementComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Demo route (public)
  { 
    path: 'demo', 
    loadChildren: () => import('./modules/demo/demo.module').then(m => m.DemoModule)
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
    path: 'customers', 
    loadChildren: () => import('./modules/customer-management/customer-management.module').then(m => m.CustomerManagementModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'analytics', 
    loadChildren: () => import('./modules/analytics/analytics.module').then(m => m.AnalyticsModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'settings', 
    loadChildren: () => import('./modules/store-settings/store-settings.module').then(m => m.StoreSettingsModule), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'messages', 
    loadChildren: () => import('./modules/messaging/messaging.module').then(m => m.MessagingModule), 
    canActivate: [AuthGuard] 
  },
  
  // SMS Campaign Management
  { 
    path: 'sms-campaigns', 
    loadChildren: () => import('./modules/sms-campaigns/sms-campaigns.module').then(m => m.SmsCampaignsModule), 
    canActivate: [AuthGuard] 
  },
  
  // Social Media Integration
  { 
    path: 'social-media', 
    loadChildren: () => import('./modules/social-media/social-media.module').then(m => m.SocialMediaModule), 
    canActivate: [AuthGuard] 
  },
  
  // Payment Management
  { 
    path: 'payments', 
    loadChildren: () => import('./modules/payment-management/payment-management.module').then(m => m.PaymentManagementModule), 
    canActivate: [AuthGuard] 
  },
  
  // Platform admin routes (separate from store management)
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/platform-admin/platform-admin.module').then(m => m.PlatformAdminModule), 
    canActivate: [AuthGuard] 
  },
  
  // Storefront routes (public store pages - for individual shop websites)
  { 
    path: 'store/:domain', 
    loadChildren: () => import('./modules/storefront/storefront.module').then(m => m.StorefrontModule)
  },
  
  // Public store routes with custom domains
  { 
    path: 'shop/:storeId', 
    loadChildren: () => import('./modules/storefront/storefront.module').then(m => m.StorefrontModule)
  },
  
  // Catch all - redirect to homepage
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    enableTracing: false // Set to true for debugging
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

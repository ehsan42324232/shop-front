import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductDetailComponent } from './components/product/product-detail/product-detail.component';
import { BasketComponent } from './components/basket/basket.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'search', component: ProductListComponent },
  { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
  // Temporarily removed lazy loaded modules until they are created
  // { path: 'orders', loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule), canActivate: [AuthGuard] },
  // { path: 'stores', loadChildren: () => import('./modules/stores/stores.module').then(m => m.StoresModule), canActivate: [AuthGuard] },
  // { path: 'profile', loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

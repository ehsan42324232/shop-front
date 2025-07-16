import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreAdminLayoutComponent } from './components/layout/store-admin-layout.component';
import { StoreDashboardComponent } from './components/dashboard/store-dashboard.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';
import { CreateProductComponent } from './components/products/create-product.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import { StoreSettingsComponent } from './components/settings/store-settings.component';

const routes: Routes = [
  {
    path: '',
    component: StoreAdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StoreDashboardComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/create', component: CreateProductComponent },
      { path: 'products/:id/edit', component: CreateProductComponent },
      { path: 'attributes', component: AttributesComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'import', component: ImportDataComponent },
      { path: 'settings', component: StoreSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreAdminRoutingModule { }

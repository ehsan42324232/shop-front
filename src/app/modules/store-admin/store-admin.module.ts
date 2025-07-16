import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreAdminRoutingModule } from './store-admin-routing.module';

// Components
import { StoreAdminLayoutComponent } from './components/layout/store-admin-layout.component';
import { StoreDashboardComponent } from './components/dashboard/store-dashboard.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';
import { CreateProductComponent } from './components/products/create-product.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import { StoreSettingsComponent } from './components/settings/store-settings.component';

@NgModule({
  declarations: [
    StoreAdminLayoutComponent,
    StoreDashboardComponent,
    CategoriesComponent,
    ProductsComponent,
    CreateProductComponent,
    AttributesComponent,
    OrdersComponent,
    ImportDataComponent,
    StoreSettingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StoreAdminRoutingModule
  ]
})
export class StoreAdminModule { }

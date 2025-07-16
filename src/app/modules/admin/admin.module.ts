import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

// Components
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StoresComponent } from './components/stores/stores.component';
import { CreateStoreComponent } from './components/stores/create-store.component';
import { StoreDetailComponent } from './components/stores/store-detail.component';
import { BulkImportComponent } from './components/bulk-import/bulk-import.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    StoresComponent,
    CreateStoreComponent,
    StoreDetailComponent,
    BulkImportComponent,
    AnalyticsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

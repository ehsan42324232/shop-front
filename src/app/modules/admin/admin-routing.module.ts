import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StoresComponent } from './components/stores/stores.component';
import { CreateStoreComponent } from './components/stores/create-store.component';
import { StoreDetailComponent } from './components/stores/store-detail.component';
import { BulkImportComponent } from './components/bulk-import/bulk-import.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'stores', component: StoresComponent },
      { path: 'stores/create', component: CreateStoreComponent },
      { path: 'stores/:id', component: StoreDetailComponent },
      { path: 'bulk-import', component: BulkImportComponent },
      { path: 'analytics', component: AnalyticsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

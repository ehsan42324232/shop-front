import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PlatformAdminDashboardComponent } from './platform-admin-dashboard/platform-admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PlatformAdminDashboardComponent
  }
];

@NgModule({
  declarations: [
    PlatformAdminDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PlatformAdminModule { }
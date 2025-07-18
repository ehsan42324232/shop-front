import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoreDashboardComponent } from './store-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: StoreDashboardComponent
  }
];

@NgModule({
  declarations: [
    StoreDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StoreDashboardModule { }
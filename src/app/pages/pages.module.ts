import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

// Page Components
import { HomepageComponent } from './homepage/homepage.component';
import { MallHomepageComponent } from './mall-homepage/mall-homepage.component';

@NgModule({
  declarations: [
    // Remove these from here since they're already in app.module.ts
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule
  ],
  exports: [
    // Export components if needed by other modules
  ]
})
export class PagesModule { }

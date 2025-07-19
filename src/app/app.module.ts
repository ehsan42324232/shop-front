import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeFa from '@angular/common/locales/fa';

// Register Farsi locale
registerLocaleData(localeFa);

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Platform Components (Store Management Focus)
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PlatformHomeComponent } from './components/platform/platform-home/platform-home.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

// Guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadingComponent,
    LoginComponent,
    RegisterComponent,
    PlatformHomeComponent,
    StoreManagementComponent
    // Removed: ProductListComponent, ProductDetailComponent, BasketComponent, CheckoutComponent
    // These are now for individual store websites, not the platform
  ],
  imports: [
    BrowserModule,
    CommonModule, // Added CommonModule for number pipe and slice pipe support
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    // PrimeNG Modules - Re-added after adding to package.json
    ButtonModule,
    AccordionModule,
    CardModule,
    ProgressSpinnerModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    RadioButtonModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'fa' // Set Farsi as default locale
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

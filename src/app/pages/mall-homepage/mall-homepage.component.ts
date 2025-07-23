import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface PlatformStats {
  total_stores: number;
  total_products: number;
  total_orders: number;
  happy_customers: number;
}

interface PlatformFeature {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

interface HomepageData {
  platform_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image?: string;
  hero_video?: string;
  features: PlatformFeature[];
  statistics: PlatformStats;
  contact: {
    email: string;
    phone: string;
    telegram?: string;
    instagram?: string;
  };
}

@Component({
  selector: 'app-mall-homepage',
  templateUrl: './mall-homepage.component.html',
  styleUrls: ['./mall-homepage.component.css']
})
export class MallHomepageComponent implements OnInit {
  homepageData: HomepageData | null = null;
  loading = true;
  error: string | null = null;
  
  // Contact form
  showContactForm = false;
  contactForm = {
    full_name: '',
    email: '',
    phone: '',
    store_name: '',
    store_description: '',
    business_type: '',
    preferred_domain: '',
    has_custom_domain: false,
    custom_domain: '',
    estimated_products: null,
    has_physical_store: false
  };
  
  submittingContact = false;
  contactSuccess = false;
  
  // Newsletter
  newsletterEmail = '';
  newsletterSubmitting = false;
  newsletterSuccess = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadHomepageData();
  }

  loadHomepageData(): void {
    this.http.get<HomepageData>(`${environment.apiUrl}/api/platform/homepage/`)
      .subscribe({
        next: (data) => {
          this.homepageData = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری اطلاعات:', error);
          this.error = 'خطا در بارگذاری اطلاعات';
          this.loading = false;
        }
      });
  }

  showRequestForm(): void {
    this.showContactForm = true;
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('contact-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  submitContactForm(): void {
    if (this.submittingContact) return;
    
    this.submittingContact = true;
    
    this.http.post(`${environment.apiUrl}/api/platform/store-request/`, this.contactForm)
      .subscribe({
        next: (response: any) => {
          this.contactSuccess = true;
          this.showContactForm = false;
          this.resetContactForm();
          this.submittingContact = false;
          
          // Show success message
          alert(response.message || 'درخواست شما با موفقیت ثبت شد');
        },
        error: (error) => {
          console.error('خطا در ثبت درخواست:', error);
          alert('خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.');
          this.submittingContact = false;
        }
      });
  }

  subscribeNewsletter(): void {
    if (this.newsletterSubmitting || !this.newsletterEmail) return;
    
    this.newsletterSubmitting = true;
    
    this.http.post(`${environment.apiUrl}/api/platform/newsletter/`, {
      email: this.newsletterEmail
    }).subscribe({
      next: (response: any) => {
        this.newsletterSuccess = true;
        this.newsletterEmail = '';
        this.newsletterSubmitting = false;
        
        // Show success message
        alert(response.message || 'با موفقیت در خبرنامه عضو شدید');
      },
      error: (error) => {
        console.error('خطا در عضویت خبرنامه:', error);
        alert('خطا در عضویت خبرنامه. لطفاً دوباره تلاش کنید.');
        this.newsletterSubmitting = false;
      }
    });
  }

  resetContactForm(): void {
    this.contactForm = {
      full_name: '',
      email: '',
      phone: '',
      store_name: '',
      store_description: '',
      business_type: '',
      preferred_domain: '',
      has_custom_domain: false,
      custom_domain: '',
      estimated_products: null,
      has_physical_store: false
    };
  }

  closeContactForm(): void {
    this.showContactForm = false;
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
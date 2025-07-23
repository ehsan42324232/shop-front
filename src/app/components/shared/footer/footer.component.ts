import { Component, OnInit } from '@angular/core';
import { HomepageService } from '../../../services/homepage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  
  currentYear = new Date().getFullYear();
  newsletterEmail = '';
  isSubscribing = false;
  
  // Footer links
  footerLinks = {
    platform: [
      { title: 'ویژگی‌ها', href: '#features' },
      { title: 'قیمت‌ها', href: '#pricing' },
      { title: 'نمونه فروشگاه‌ها', href: '#demos' },
      { title: 'آموزش‌ها', href: '#tutorials' }
    ],
    support: [
      { title: 'پشتیبانی', href: '#support' },
      { title: 'مرکز راهنمایی', href: '#help' },
      { title: 'سوالات متداول', href: '#faq' },
      { title: 'تماس با ما', href: '#contact' }
    ],
    legal: [
      { title: 'قوانین و مقررات', href: '#terms' },
      { title: 'حریم خصوصی', href: '#privacy' },
      { title: 'درباره ما', href: '#about' },
      { title: 'فرصت‌های شغلی', href: '#careers' }
    ]
  };

  // Social media links
  socialLinks = [
    { name: 'تلگرام', icon: 'telegram', url: 'https://t.me/mallplatform' },
    { name: 'اینستاگرام', icon: 'instagram', url: 'https://instagram.com/mallplatform' },
    { name: 'لینکدین', icon: 'linkedin', url: 'https://linkedin.com/company/mallplatform' },
    { name: 'توییتر', icon: 'twitter', url: 'https://twitter.com/mallplatform' }
  ];

  constructor(private homepageService: HomepageService) { }

  ngOnInit(): void {
  }

  /**
   * Subscribe to newsletter
   */
  subscribeNewsletter(): void {
    if (!this.newsletterEmail.trim()) {
      alert('لطفاً ایمیل خود را وارد کنید.');
      return;
    }

    if (!this.homepageService.validateEmail(this.newsletterEmail)) {
      alert('لطفاً ایمیل معتبر وارد کنید.');
      return;
    }

    this.isSubscribing = true;

    this.homepageService.subscribeNewsletter(this.newsletterEmail, 'footer')
      .subscribe({
        next: (response) => {
          this.isSubscribing = false;
          if (response.success) {
            alert('با موفقیت در خبرنامه ثبت نام شدید!');
            this.newsletterEmail = '';
          } else {
            alert(response.message || 'خطایی رخ داد.');
          }
        },
        error: (error) => {
          this.isSubscribing = false;
          alert(error.message);
        }
      });
  }

  /**
   * Scroll to section
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Open external link
   */
  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

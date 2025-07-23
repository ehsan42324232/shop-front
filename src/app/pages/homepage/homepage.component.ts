import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  
  features = [
    {
      title: 'فروشگاه آنلاین حرفه‌ای',
      description: 'با چند کلیک فروشگاه آنلاین خود را راه‌اندازی کنید',
      icon: 'store',
      image: '/assets/images/feature1.jpg'
    },
    {
      title: 'مدیریت محصولات پیشرفته',
      description: 'سیستم مدیریت محصولات با ویژگی‌های کامل',
      icon: 'inventory',
      image: '/assets/images/feature2.jpg'
    },
    {
      title: 'پرداخت‌های امن',
      description: 'اتصال به درگاه‌های پرداخت معتبر ایرانی',
      icon: 'payment',
      image: '/assets/images/feature3.jpg'
    },
    {
      title: 'ارسال و لجستیک',
      description: 'اتصال به شرکت‌های حمل و نقل معتبر',
      icon: 'local_shipping',
      image: '/assets/images/feature4.jpg'
    }
  ];

  stats = [
    { label: 'فروشگاه‌های فعال', value: '1000+' },
    { label: 'فروش روزانه', value: '50 میلیون تومان' },
    { label: 'کاربران راضی', value: '99%' },
    { label: 'سال تجربه', value: '5+' }
  ];

  testimonials = [
    {
      name: 'احمد محمدی',
      business: 'فروشگاه پوشاک آنلاین',
      content: 'با پلتفرم مال تونستم فروشگاهم رو به راحتی راه‌اندازی کنم و درآمدم دو برابر شده.',
      avatar: '/assets/images/testimonial1.jpg'
    },
    {
      name: 'فاطمه کریمی',
      business: 'فروشگاه لوازم خانه',
      content: 'رابط کاربری ساده و قابلیت‌های عالی. پشتیبانی فوق‌العاده و همیشه در دسترس.',
      avatar: '/assets/images/testimonial2.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.animateCounters();
  }

  animateCounters() {
    // Animation logic for statistics counters
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent || '0');
      let current = 0;
      const increment = target / 50;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current).toString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toString();
        }
      };
      
      updateCounter();
    });
  }

  scrollToFeatures() {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  openRequestForm() {
    // Open popup form for demo request
    const modal = document.getElementById('requestModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeRequestForm() {
    const modal = document.getElementById('requestModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  submitRequest(form: any) {
    // Handle form submission
    console.log('Form submitted:', form.value);
    // Add API call here
    this.closeRequestForm();
  }
}

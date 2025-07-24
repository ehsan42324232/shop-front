import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  badge?: number;
  children?: MenuItem[];
}

@Component({
  selector: 'app-mobile-navigation',
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss']
})
export class MobileNavigationComponent implements OnInit {
  @Input() isOpen = false;
  @Input() userProfile: any = null;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() menuItemClick = new EventEmitter<MenuItem>();

  menuItems: MenuItem[] = [
    {
      id: 'home',
      title: 'صفحه اصلی',
      icon: 'home',
      route: '/'
    },
    {
      id: 'categories',
      title: 'دسته‌بندی‌ها',
      icon: 'grid',
      children: [
        { id: 'clothing', title: 'پوشاک', icon: 'shirt', route: '/category/clothing' },
        { id: 'electronics', title: 'الکترونیک', icon: 'smartphone', route: '/category/electronics' },
        { id: 'home-garden', title: 'خانه و باغ', icon: 'home', route: '/category/home-garden' },
        { id: 'books', title: 'کتاب', icon: 'book', route: '/category/books' },
        { id: 'sports', title: 'ورزش', icon: 'activity', route: '/category/sports' }
      ]
    },
    {
      id: 'offers',
      title: 'پیشنهادات ویژه',
      icon: 'percent',
      route: '/offers',
      badge: 5
    },
    {
      id: 'cart',
      title: 'سبد خرید',
      icon: 'shopping-cart',
      route: '/cart',
      badge: 3
    },
    {
      id: 'orders',
      title: 'سفارش‌های من',
      icon: 'package',
      route: '/orders'
    },
    {
      id: 'wishlist',
      title: 'علاقه‌مندی‌ها',
      icon: 'heart',
      route: '/wishlist',
      badge: 12
    },
    {
      id: 'wallet',
      title: 'کیف پول',
      icon: 'credit-card',
      route: '/wallet'
    },
    {
      id: 'notifications',
      title: 'اطلاعیه‌ها',
      icon: 'bell',
      route: '/notifications',
      badge: 2
    },
    {
      id: 'support',
      title: 'پشتیبانی',
      icon: 'headphones',
      route: '/support'
    },
    {
      id: 'about',
      title: 'درباره ما',
      icon: 'info',
      route: '/about'
    }
  ];

  expandedItems: Set<string> = new Set();
  searchQuery = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onBackdropClick(): void {
    this.closeMenu.emit();
  }

  onMenuItemClick(item: MenuItem, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // If item has children, toggle expansion
    if (item.children && item.children.length > 0) {
      this.toggleExpansion(item.id);
      return;
    }

    // Navigate to route if available
    if (item.route) {
      this.router.navigate([item.route]);
      this.closeMenu.emit();
    }

    // Emit menu item click event
    this.menuItemClick.emit(item);
  }

  toggleExpansion(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
      this.closeMenu.emit();
      this.searchQuery = '';
    }
  }

  onProfileClick(): void {
    if (this.userProfile) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
    this.closeMenu.emit();
  }

  onLogout(): void {
    // Implement logout logic
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/']);
    this.closeMenu.emit();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  }

  getProfileInitials(): string {
    if (this.userProfile?.user?.first_name && this.userProfile?.user?.last_name) {
      return (this.userProfile.user.first_name[0] + this.userProfile.user.last_name[0]).toUpperCase();
    } else if (this.userProfile?.user?.username) {
      return this.userProfile.user.username.substring(0, 2).toUpperCase();
    }
    return 'کاربر';
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'صبح بخیر';
    } else if (hour < 18) {
      return 'ظهر بخیر';
    } else {
      return 'عصر بخیر';
    }
  }

  // Quick actions
  quickActions = [
    {
      id: 'scan',
      title: 'اسکن کد',
      icon: 'camera',
      action: () => this.openBarcodeScanner()
    },
    {
      id: 'voice-search',
      title: 'جستجوی صوتی',
      icon: 'mic',
      action: () => this.startVoiceSearch()
    },
    {
      id: 'nearby-stores',
      title: 'فروشگاه‌های نزدیک',
      icon: 'map-pin',
      action: () => this.findNearbyStores()
    },
    {
      id: 'compare',
      title: 'مقایسه محصولات',
      icon: 'bar-chart-2',
      action: () => this.openProductComparison()
    }
  ];

  onQuickActionClick(action: any): void {
    action.action();
    this.closeMenu.emit();
  }

  private openBarcodeScanner(): void {
    // Implement barcode scanner
    console.log('Opening barcode scanner...');
  }

  private startVoiceSearch(): void {
    // Implement voice search
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'fa-IR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.searchQuery = transcript;
        this.onSearch();
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    } else {
      alert('جستجوی صوتی در این مرورگر پشتیبانی نمی‌شود');
    }
  }

  private findNearbyStores(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.router.navigate(['/stores/nearby'], {
            queryParams: { lat, lng }
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('دسترسی به موقعیت مکانی امکان‌پذیر نیست');
        }
      );
    } else {
      alert('موقعیت‌یابی در این مرورگر پشتیبانی نمی‌شود');
    }
  }

  private openProductComparison(): void {
    this.router.navigate(['/compare']);
  }

  // Theme switching
  currentTheme = 'light';

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  // Language switching
  currentLanguage = 'fa';
  
  switchLanguage(): void {
    // Implement language switching logic
    this.currentLanguage = this.currentLanguage === 'fa' ? 'en' : 'fa';
    localStorage.setItem('language', this.currentLanguage);
    // Reload or update UI language
  }

  // Accessibility features
  increaseFontSize(): void {
    const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = (currentSize + 2) + 'px';
  }

  decreaseFontSize(): void {
    const currentSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    if (currentSize > 12) {
      document.documentElement.style.fontSize = (currentSize - 2) + 'px';
    }
  }

  toggleHighContrast(): void {
    document.body.classList.toggle('high-contrast');
  }

  // Social sharing
  shareApp(): void {
    if (navigator.share) {
      navigator.share({
        title: 'فروشگاه مال',
        text: 'بهترین فروشگاه آنلاین ایران',
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = window.location.origin;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('آدرس فروشگاه کپی شد');
      });
    }
  }

  // App info
  getAppVersion(): string {
    return '1.2.0';
  }

  getBuildNumber(): string {
    return '2024.07.24';
  }

  // Emergency contact
  callSupport(): void {
    window.location.href = 'tel:+982188888888';
  }

  openWhatsApp(): void {
    window.open('https://wa.me/989121234567', '_blank');
  }

  openTelegram(): void {
    window.open('https://t.me/mall_support', '_blank');
  }
}

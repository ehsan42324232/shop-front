import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface StoreTheme {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

interface StoreLayout {
  id: string;
  name: string;
  preview: string;
  type: 'grid' | 'list' | 'carousel' | 'masonry';
}

@Component({
  selector: 'app-store-customization',
  templateUrl: './store-customization.component.html',
  styleUrls: ['./store-customization.component.css']
})
export class StoreCustomizationComponent implements OnInit {
  @Input() storeId: number | null = null;
  @Output() onThemeChange = new EventEmitter<StoreTheme>();
  @Output() onLayoutChange = new EventEmitter<StoreLayout>();

  // State
  loading = false;
  saving = false;
  error: string | null = null;
  previewMode = false;

  // Themes and layouts
  availableThemes: StoreTheme[] = [];
  availableLayouts: StoreLayout[] = [];
  selectedTheme: StoreTheme | null = null;
  selectedLayout: StoreLayout | null = null;

  // Current store settings
  currentSettings = {
    theme_id: '',
    layout_id: '',
    custom_css: '',
    logo_url: '',
    banner_url: '',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    fonts: {
      heading: 'IRANSans',
      body: 'IRANSans'
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAvailableOptions();
    if (this.storeId) {
      this.loadCurrentSettings();
    }
  }

  // ===============================
  // Data Loading
  // ===============================

  loadAvailableOptions(): void {
    this.loading = true;
    
    // Load themes
    this.http.get<StoreTheme[]>(`${environment.apiUrl}/api/store/themes/`)
      .subscribe({
        next: (themes) => {
          this.availableThemes = themes;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری قالب‌ها:', error);
          this.loadDefaultThemes();
          this.loading = false;
        }
      });

    // Load layouts
    this.http.get<StoreLayout[]>(`${environment.apiUrl}/api/store/layouts/`)
      .subscribe({
        next: (layouts) => {
          this.availableLayouts = layouts;
        },
        error: (error) => {
          console.error('خطا در بارگذاری چیدمان‌ها:', error);
          this.loadDefaultLayouts();
        }
      });
  }

  loadCurrentSettings(): void {
    if (!this.storeId) return;

    this.http.get(`${environment.apiUrl}/api/store/${this.storeId}/settings/`)
      .subscribe({
        next: (settings: any) => {
          this.currentSettings = { ...this.currentSettings, ...settings };
          this.selectThemeById(settings.theme_id);
          this.selectLayoutById(settings.layout_id);
        },
        error: (error) => {
          console.error('خطا در بارگذاری تنظیمات فروشگاه:', error);
          this.error = 'خطا در بارگذاری تنظیمات فروشگاه';
        }
      });
  }

  // ===============================
  // Theme Management
  // ===============================

  selectTheme(theme: StoreTheme): void {
    this.selectedTheme = theme;
    this.currentSettings.theme_id = theme.id;
    this.currentSettings.colors = { ...theme.colors };
    
    this.onThemeChange.emit(theme);
    this.applyThemePreview();
  }

  selectThemeById(themeId: string): void {
    const theme = this.availableThemes.find(t => t.id === themeId);
    if (theme) {
      this.selectTheme(theme);
    }
  }

  applyThemePreview(): void {
    if (!this.selectedTheme) return;

    // Apply theme colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', this.selectedTheme.colors.primary);
    root.style.setProperty('--theme-secondary', this.selectedTheme.colors.secondary);
    root.style.setProperty('--theme-background', this.selectedTheme.colors.background);
    root.style.setProperty('--theme-text', this.selectedTheme.colors.text);
  }

  // ===============================
  // Layout Management
  // ===============================

  selectLayout(layout: StoreLayout): void {
    this.selectedLayout = layout;
    this.currentSettings.layout_id = layout.id;
    
    this.onLayoutChange.emit(layout);
  }

  selectLayoutById(layoutId: string): void {
    const layout = this.availableLayouts.find(l => l.id === layoutId);
    if (layout) {
      this.selectLayout(layout);
    }
  }

  // ===============================
  // Color Customization
  // ===============================

  updateColor(colorType: 'primary' | 'secondary' | 'background' | 'text', color: string): void {
    this.currentSettings.colors[colorType] = color;
    this.applyColorPreview();
  }

  applyColorPreview(): void {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', this.currentSettings.colors.primary);
    root.style.setProperty('--theme-secondary', this.currentSettings.colors.secondary);
    root.style.setProperty('--theme-background', this.currentSettings.colors.background);
    root.style.setProperty('--theme-text', this.currentSettings.colors.text);
  }

  resetColors(): void {
    if (this.selectedTheme) {
      this.currentSettings.colors = { ...this.selectedTheme.colors };
      this.applyColorPreview();
    }
  }

  // ===============================
  // Font Management
  // ===============================

  updateFont(fontType: 'heading' | 'body', font: string): void {
    this.currentSettings.fonts[fontType] = font;
    this.applyFontPreview();
  }

  applyFontPreview(): void {
    const root = document.documentElement;
    root.style.setProperty('--font-heading', this.currentSettings.fonts.heading);
    root.style.setProperty('--font-body', this.currentSettings.fonts.body);
  }

  // ===============================
  // File Upload
  // ===============================

  onLogoUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadFile(file, 'logo');
  }

  onBannerUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadFile(file, 'banner');
  }

  uploadFile(file: File, type: 'logo' | 'banner'): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('store_id', this.storeId?.toString() || '');

    this.http.post<{url: string}>(`${environment.apiUrl}/api/store/upload-media/`, formData)
      .subscribe({
        next: (response) => {
          if (type === 'logo') {
            this.currentSettings.logo_url = response.url;
          } else {
            this.currentSettings.banner_url = response.url;
          }
        },
        error: (error) => {
          console.error(`خطا در آپلود ${type}:`, error);
          this.error = `خطا در آپلود ${type === 'logo' ? 'لوگو' : 'بنر'}`;
        }
      });
  }

  // ===============================
  // Preview Mode
  // ===============================

  togglePreview(): void {
    this.previewMode = !this.previewMode;
    
    if (this.previewMode) {
      this.applyFullPreview();
    } else {
      this.resetPreview();
    }
  }

  applyFullPreview(): void {
    this.applyThemePreview();
    this.applyColorPreview();
    this.applyFontPreview();
  }

  resetPreview(): void {
    const root = document.documentElement;
    root.style.removeProperty('--theme-primary');
    root.style.removeProperty('--theme-secondary');
    root.style.removeProperty('--theme-background');
    root.style.removeProperty('--theme-text');
    root.style.removeProperty('--font-heading');
    root.style.removeProperty('--font-body');
  }

  // ===============================
  // Save Settings
  // ===============================

  saveSettings(): void {
    if (!this.storeId) {
      this.error = 'شناسه فروشگاه موجود نیست';
      return;
    }

    this.saving = true;
    this.error = null;

    this.http.put(`${environment.apiUrl}/api/store/${this.storeId}/settings/`, this.currentSettings)
      .subscribe({
        next: (response) => {
          this.saving = false;
          alert('تنظیمات با موفقیت ذخیره شد');
        },
        error: (error) => {
          console.error('خطا در ذخیره تنظیمات:', error);
          this.error = 'خطا در ذخیره تنظیمات';
          this.saving = false;
        }
      });
  }

  // ===============================
  // Default Data
  // ===============================

  loadDefaultThemes(): void {
    this.availableThemes = [
      {
        id: 'modern-blue',
        name: 'مدرن آبی',
        preview: 'assets/themes/modern-blue.jpg',
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          background: '#FFFFFF',
          text: '#1F2937'
        }
      },
      {
        id: 'elegant-purple',
        name: 'شیک بنفش',
        preview: 'assets/themes/elegant-purple.jpg',
        colors: {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          background: '#F9FAFB',
          text: '#111827'
        }
      },
      {
        id: 'warm-orange',
        name: 'گرم نارنجی',
        preview: 'assets/themes/warm-orange.jpg',
        colors: {
          primary: '#F59E0B',
          secondary: '#EF4444',
          background: '#FFFBEB',
          text: '#1F2937'
        }
      }
    ];
  }

  loadDefaultLayouts(): void {
    this.availableLayouts = [
      {
        id: 'grid-modern',
        name: 'شبکه مدرن',
        preview: 'assets/layouts/grid-modern.jpg',
        type: 'grid'
      },
      {
        id: 'list-classic',
        name: 'لیست کلاسیک',
        preview: 'assets/layouts/list-classic.jpg',
        type: 'list'
      },
      {
        id: 'carousel-dynamic',
        name: 'کاروسل پویا',
        preview: 'assets/layouts/carousel-dynamic.jpg',
        type: 'carousel'
      }
    ];
  }
}
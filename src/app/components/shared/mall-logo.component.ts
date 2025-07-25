import { Component, Input } from '@angular/core';

/**
 * Mall Logo Component
 * Red, Blue, and White design as specified in product description
 */
@Component({
  selector: 'app-mall-logo',
  template: `
    <div class="mall-logo" [class.size-sm]="size === 'sm'" [class.size-lg]="size === 'lg'">
      <svg class="logo-svg" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Red to Blue Gradient -->
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#DC2626" />
            <stop offset="50%" stop-color="#2563EB" />
            <stop offset="100%" stop-color="#1E40AF" />
          </linearGradient>
          
          <!-- White highlight gradient -->
          <linearGradient id="whiteHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.1" />
          </linearGradient>

          <!-- Shadow filter -->
          <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
        </defs>

        <!-- Background Circle -->
        <circle cx="20" cy="20" r="18" 
                fill="url(#logoGradient)" 
                filter="url(#logoShadow)"
                class="logo-background">
        </circle>

        <!-- Mall Text in Persian -->
        <text x="20" y="28" 
              text-anchor="middle" 
              fill="#FFFFFF"
              font-family="'Vazirmatn', 'Tahoma', sans-serif"
              font-size="14"
              font-weight="bold"
              class="logo-text-persian">
          مال
        </text>

        <!-- Company Name -->
        <text x="50" y="18" 
              fill="url(#logoGradient)"
              font-family="'Vazirmatn', 'Tahoma', sans-serif"
              font-size="16"
              font-weight="bold"
              class="logo-text-main">
          مال
        </text>

        <!-- Subtitle -->
        <text x="50" y="30" 
              fill="#6B7280"
              font-family="'Vazirmatn', 'Tahoma', sans-serif"
              font-size="8"
              class="logo-subtitle">
          فروشگاه‌ساز
        </text>

        <!-- Decorative elements -->
        <circle cx="100" cy="10" r="2" fill="#DC2626" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="105" cy="15" r="1.5" fill="#2563EB" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="110" cy="20" r="1" fill="#DC2626" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  `,
  styles: [`
    .mall-logo {
      display: inline-block;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .mall-logo:hover {
      transform: scale(1.05);
    }

    .logo-svg {
      width: 120px;
      height: 40px;
      overflow: visible;
    }

    .mall-logo.size-sm .logo-svg {
      width: 80px;
      height: 28px;
    }

    .mall-logo.size-lg .logo-svg {
      width: 160px;
      height: 54px;
    }

    .logo-background {
      transition: all 0.3s ease;
    }

    .mall-logo:hover .logo-background {
      filter: url(#logoShadow) brightness(1.1);
    }

    .logo-text-persian,
    .logo-text-main {
      transition: all 0.3s ease;
    }

    .mall-logo:hover .logo-text-persian,
    .mall-logo:hover .logo-text-main {
      transform: scale(1.02);
    }

    /* Font loading fallback */
    @font-face {
      font-family: 'Vazirmatn';
      src: url('/assets/fonts/Vazirmatn-Regular.woff2') format('woff2');
      font-display: swap;
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      .logo-subtitle {
        fill: #9CA3AF !important;
      }
    }

    /* Print styles */
    @media print {
      .mall-logo {
        transform: none !important;
      }
      
      .logo-svg circle:not(.logo-background) {
        display: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .logo-background {
        stroke: #000000;
        stroke-width: 1;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .mall-logo {
        transition: none;
      }
      
      .logo-svg circle animate {
        display: none;
      }
    }
  `]
})
export class MallLogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() clickable: boolean = true;

  constructor() {}

  onLogoClick() {
    if (this.clickable) {
      // Navigate to homepage or handle click
      window.location.href = '/';
    }
  }
}

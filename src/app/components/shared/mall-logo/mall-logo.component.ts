import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mall-logo',
  template: `
    <div class="mall-logo" [class]="containerClass">
      <!-- SVG Logo with red, blue, white colors as specified in product description -->
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 100 100" class="logo-svg">
        <!-- Background circle with gradient -->
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" /> <!-- Red -->
            <stop offset="50%" style="stop-color:#2563eb;stop-opacity:1" /> <!-- Blue -->
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" /> <!-- White -->
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <dropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        
        <!-- Main circle background -->
        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" filter="url(#shadow)" stroke="#e5e7eb" stroke-width="2"/>
        
        <!-- Store/Mall icon elements -->
        <!-- Building base -->
        <rect x="25" y="60" width="50" height="25" fill="#ffffff" stroke="#dc2626" stroke-width="2" rx="3"/>
        
        <!-- Shop windows -->
        <rect x="30" y="65" width="8" height="8" fill="#2563eb" rx="1"/>
        <rect x="42" y="65" width="8" height="8" fill="#2563eb" rx="1"/>
        <rect x="54" y="65" width="8" height="8" fill="#2563eb" rx="1"/>
        <rect x="66" y="65" width="8" height="8" fill="#2563eb" rx="1"/>
        
        <!-- Door -->
        <rect x="45" y="75" width="10" height="10" fill="#dc2626" rx="1"/>
        
        <!-- Roof -->
        <polygon points="20,60 50,40 80,60" fill="#dc2626" stroke="#2563eb" stroke-width="2"/>
        
        <!-- Persian text مال -->
        <text x="50" y="35" text-anchor="middle" font-family="'Vazir', 'Tahoma', sans-serif" 
              font-size="16" font-weight="bold" fill="#ffffff" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5)">
          مال
        </text>
      </svg>
      
      <!-- Text logo -->
      <span *ngIf="showText" class="logo-text" [style.font-size.px]="textSize">
        فروشگاه‌ساز مال
      </span>
    </div>
  `,
  styles: [`
    .mall-logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .logo-svg {
      flex-shrink: 0;
    }
    
    .logo-text {
      font-weight: bold;
      color: #1f2937;
      white-space: nowrap;
      font-family: 'Vazir', 'Tahoma', sans-serif;
    }
    
    .small .logo-text {
      font-size: 14px;
    }
    
    .medium .logo-text {
      font-size: 18px;
    }
    
    .large .logo-text {
      font-size: 24px;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .logo-text {
        display: none;
      }
    }
  `]
})
export class MallLogoComponent {
  @Input() size: number = 48;
  @Input() showText: boolean = true;
  @Input() textSize: number = 18;
  @Input() containerClass: string = 'medium';
}

import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-platform-home',
  templateUrl: './platform-home.component.html',
  styleUrls: ['./platform-home.component.css']
})
export class PlatformHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('storesCount', { static: false }) storesCount!: ElementRef;
  @ViewChild('revenueCount', { static: false }) revenueCount!: ElementRef;
  @ViewChild('ordersCount', { static: false }) ordersCount!: ElementRef;
  @ViewChild('categoriesCount', { static: false }) categoriesCount!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.setupSmoothScrolling();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  private setupSmoothScrolling(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector((this as HTMLAnchorElement).getAttribute('href')!);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  private animateCounter(element: HTMLElement, finalValue: number, duration: number = 2000): void {
    const start = 0;
    const increment = finalValue / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        current = finalValue;
        clearInterval(timer);
      }
      
      element.textContent = Math.floor(current).toLocaleString('fa-IR');
    }, 16);
  }

  private setupIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('bg-gray-900')) {
            // Animate stats when they come into view
            if (this.storesCount?.nativeElement) {
              this.animateCounter(this.storesCount.nativeElement, 2500);
            }
            if (this.revenueCount?.nativeElement) {
              this.animateCounter(this.revenueCount.nativeElement, 150);
            }
            if (this.ordersCount?.nativeElement) {
              this.animateCounter(this.ordersCount.nativeElement, 250000);
            }
            if (this.categoriesCount?.nativeElement) {
              this.animateCounter(this.categoriesCount.nativeElement, 1500);
            }
          }
        }
      });
    }, observerOptions);

    // Observe the stats section
    const statsSection = document.querySelector('.bg-gray-900');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }
}

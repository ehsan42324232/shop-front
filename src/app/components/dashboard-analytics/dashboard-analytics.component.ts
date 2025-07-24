import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface AnalyticsData {
  sales: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  orders: {
    pending: number;
    completed: number;
    cancelled: number;
    total: number;
  };
  customers: {
    new_today: number;
    new_week: number;
    total: number;
    returning: number;
  };
  products: {
    total: number;
    active: number;
    low_stock: number;
    views: number;
  };
}

interface SalesChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

@Component({
  selector: 'app-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.css']
})
export class DashboardAnalyticsComponent implements OnInit {
  loading = true;
  error: string | null = null;
  
  // Analytics data
  analytics: AnalyticsData | null = null;
  salesChart: SalesChart | null = null;
  
  // Chart options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ' + 
                   new Intl.NumberFormat('fa-IR').format(context.parsed.y) + ' تومان';
          }
        }
      }
    }
  };

  // Selected time range
  selectedRange = 'week';
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  // ===============================
  // Data Loading
  // ===============================

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;

    this.http.get<AnalyticsData>(`${environment.apiUrl}/api/analytics/dashboard/`)
      .subscribe({
        next: (data) => {
          this.analytics = data;
          this.loadSalesChart();
        },
        error: (error) => {
          console.error('خطا در بارگذاری آمار:', error);
          this.error = 'خطا در بارگذاری آمار داشبورد';
          this.loading = false;
        }
      });
  }

  loadSalesChart(): void {
    const params = { range: this.selectedRange };
    
    this.http.get<SalesChart>(`${environment.apiUrl}/api/analytics/sales-chart/`, { params })
      .subscribe({
        next: (chartData) => {
          this.salesChart = chartData;
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری نمودار فروش:', error);
          this.generateSampleChart();
          this.loading = false;
        }
      });
  }

  // ===============================
  // Chart Management
  // ===============================

  changeTimeRange(range: string): void {
    this.selectedRange = range;
    this.loadSalesChart();
  }

  generateSampleChart(): void {
    const now = new Date();
    const labels = [];
    const data = [];

    // Generate sample data based on selected range
    if (this.selectedRange === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('fa-IR', { weekday: 'short' }));
        data.push(Math.floor(Math.random() * 1000000) + 500000);
      }
    } else if (this.selectedRange === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.getDate().toString());
        data.push(Math.floor(Math.random() * 2000000) + 1000000);
      }
    }

    this.salesChart = {
      labels,
      datasets: [{
        label: 'فروش',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }]
    };
  }

  // ===============================
  // Utility Methods
  // ===============================

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fa-IR').format(num);
  }

  getGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  refreshData(): void {
    this.loadAnalytics();
  }

  exportData(): void {
    if (!this.analytics) return;

    const csvData = this.convertToCSV(this.analytics);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private convertToCSV(data: AnalyticsData): string {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['فروش امروز', data.sales.today.toString()],
      ['فروش هفته', data.sales.week.toString()],
      ['فروش ماه', data.sales.month.toString()],
      ['کل فروش', data.sales.total.toString()],
      ['سفارشات در انتظار', data.orders.pending.toString()],
      ['سفارشات تکمیل شده', data.orders.completed.toString()],
      ['سفارشات لغو شده', data.orders.cancelled.toString()],
      ['کل سفارشات', data.orders.total.toString()],
      ['مشتریان جدید امروز', data.customers.new_today.toString()],
      ['مشتریان جدید هفته', data.customers.new_week.toString()],
      ['کل مشتریان', data.customers.total.toString()],
      ['مشتریان بازگشتی', data.customers.returning.toString()],
      ['کل محصولات', data.products.total.toString()],
      ['محصولات فعال', data.products.active.toString()],
      ['محصولات کم موجود', data.products.low_stock.toString()],
      ['بازدید محصولات', data.products.views.toString()]
    ];

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  }
}
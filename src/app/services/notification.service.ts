import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private notificationCounter = 0;

  public notifications$ = this.notifications.asObservable();

  constructor() { }

  /**
   * Show success notification
   */
  success(message: string, title?: string, duration: number = 5000): void {
    this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  /**
   * Show error notification
   */
  error(message: string, title?: string, persistent: boolean = false): void {
    this.show({
      type: 'error',
      title,
      message,
      persistent,
      duration: persistent ? 0 : 8000
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, title?: string, duration: number = 6000): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  /**
   * Show info notification
   */
  info(message: string, title?: string, duration: number = 5000): void {
    this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  /**
   * Show custom notification
   */
  show(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, fullNotification]);

    // Auto-remove notification after duration (if not persistent)
    if (!fullNotification.persistent && fullNotification.duration! > 0) {
      setTimeout(() => {
        this.remove(id);
      }, fullNotification.duration);
    }
  }

  /**
   * Remove notification by ID
   */
  remove(id: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(updatedNotifications);
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications.next([]);
  }

  /**
   * Show loading notification that can be updated
   */
  showLoading(message: string, title?: string): string {
    const id = this.generateId();
    const currentNotifications = this.notifications.value;
    const loadingNotification: Notification = {
      id,
      type: 'info',
      title,
      message,
      persistent: true
    };
    
    this.notifications.next([...currentNotifications, loadingNotification]);
    return id;
  }

  /**
   * Update loading notification to success
   */
  updateLoadingToSuccess(id: string, message: string, title?: string): void {
    this.remove(id);
    this.success(message, title);
  }

  /**
   * Update loading notification to error
   */
  updateLoadingToError(id: string, message: string, title?: string): void {
    this.remove(id);
    this.error(message, title);
  }

  /**
   * Show confirmation notification with actions
   */
  confirm(
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    title?: string
  ): void {
    const actions: NotificationAction[] = [
      {
        label: 'تأیید',
        action: () => {
          onConfirm();
        },
        style: 'primary'
      }
    ];

    if (onCancel) {
      actions.push({
        label: 'انصراف',
        action: onCancel,
        style: 'secondary'
      });
    }

    this.show({
      type: 'warning',
      title: title || 'تأیید عملیات',
      message,
      persistent: true,
      actions
    });
  }

  /**
   * Generate unique ID for notifications
   */
  private generateId(): string {
    return `notification_${++this.notificationCounter}_${Date.now()}`;
  }

  /**
   * Show API error notification with proper Persian messages
   */
  showApiError(error: any): void {
    let message = 'خطایی رخ داده است. لطفاً مجدداً تلاش کنید.';
    let title = 'خطا';

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error?.status) {
      switch (error.status) {
        case 400:
          message = 'درخواست نامعتبر است.';
          break;
        case 401:
          message = 'احراز هویت انجام نشده است.';
          title = 'خطای احراز هویت';
          break;
        case 403:
          message = 'دسترسی به این بخش ندارید.';
          title = 'عدم دسترسی';
          break;
        case 404:
          message = 'اطلاعات درخواستی یافت نشد.';
          break;
        case 422:
          message = 'اطلاعات وارد شده معتبر نیست.';
          title = 'خطای اعتبارسنجی';
          break;
        case 429:
          message = 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.';
          title = 'محدودیت درخواست';
          break;
        case 500:
          message = 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.';
          title = 'خطای سرور';
          break;
        case 503:
          message = 'سرویس در حال حاضر در دسترس نیست.';
          title = 'سرویس غیرفعال';
          break;
        default:
          message = `خطای ${error.status}: ${error.statusText || 'خطای ناشناخته'}`;
      }
    }

    this.error(message, title);
  }

  /**
   * Show network error notification
   */
  showNetworkError(): void {
    this.error(
      'خطا در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.',
      'خطای شبکه'
    );
  }

  /**
   * Show validation errors
   */
  showValidationErrors(errors: { [key: string]: string[] }): void {
    const errorMessages: string[] = [];
    Object.values(errors).forEach(errorArray => {
      errorMessages.push(...errorArray);
    });
    const message = errorMessages.join('\n');
    this.error(message, 'خطای اعتبارسنجی');
  }

  /**
   * Show form submission success
   */
  showFormSuccess(formName: string = 'فرم'): void {
    this.success(`${formName} با موفقیت ارسال شد.`);
  }

  /**
   * Show save success
   */
  showSaveSuccess(itemName: string = 'اطلاعات'): void {
    this.success(`${itemName} با موفقیت ذخیره شد.`);
  }

  /**
   * Show delete success
   */
  showDeleteSuccess(itemName: string = 'آیتم'): void {
    this.success(`${itemName} با موفقیت حذف شد.`);
  }

  /**
   * Show update success
   */
  showUpdateSuccess(itemName: string = 'اطلاعات'): void {
    this.success(`${itemName} با موفقیت به‌روزرسانی شد.`);
  }

  /**
   * Show maintenance notification
   */
  showMaintenance(): void {
    this.warning(
      'سیستم در حال به‌روزرسانی است. ممکن است برخی ویژگی‌ها موقتاً در دسترس نباشند.',
      'تعمیرات سیستم',
      10000
    );
  }

  /**
   * Show welcome notification for new users
   */
  showWelcome(userName?: string): void {
    const message = userName 
      ? `${userName} عزیز، به پلتفرم مال خوش آمدید!`
      : 'به پلتفرم مال خوش آمدید!';
    
    this.success(message, 'خوش آمدید', 7000);
  }

  /**
   * Show feature unavailable notification
   */
  showFeatureUnavailable(featureName: string = 'این ویژگی'): void {
    this.info(
      `${featureName} به زودی در دسترس خواهد بود.`,
      'در حال توسعه'
    );
  }
}

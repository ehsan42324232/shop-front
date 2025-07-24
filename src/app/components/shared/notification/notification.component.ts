import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications; trackBy: trackByNotification" 
        class="notification"
        [ngClass]="'notification--' + notification.type"
        [@slideIn]>
        
        <div class="notification__icon">
          <i class="fas" [ngClass]="{
            'fa-check-circle': notification.type === 'success',
            'fa-exclamation-circle': notification.type === 'error',
            'fa-exclamation-triangle': notification.type === 'warning',
            'fa-info-circle': notification.type === 'info'
          }"></i>
        </div>
        
        <div class="notification__content">
          <div class="notification__title" *ngIf="notification.title">
            {{ notification.title }}
          </div>
          <div class="notification__message">
            {{ notification.message }}
          </div>
          
          <div class="notification__actions" *ngIf="notification.actions && notification.actions.length > 0">
            <button 
              *ngFor="let action of notification.actions"
              class="btn btn--sm"
              [ngClass]="'btn--' + (action.style || 'secondary')"
              (click)="executeAction(action, notification.id)">
              {{ action.label }}
            </button>
          </div>
        </div>
        
        <button 
          class="notification__close"
          (click)="closeNotification(notification.id)"
          *ngIf="!notification.persistent || (notification.actions && notification.actions.length > 0)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 9999;
      pointer-events: none;
      max-width: 400px;
      width: 100%;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      margin-bottom: 12px;
      pointer-events: auto;
      border-right: 4px solid;
      position: relative;
      max-width: 100%;
      word-wrap: break-word;
    }

    .notification--success {
      border-right-color: #10b981;
    }

    .notification--error {
      border-right-color: #ef4444;
    }

    .notification--warning {
      border-right-color: #f59e0b;
    }

    .notification--info {
      border-right-color: #3b82f6;
    }

    .notification__icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .notification--success .notification__icon {
      color: #10b981;
    }

    .notification--error .notification__icon {
      color: #ef4444;
    }

    .notification--warning .notification__icon {
      color: #f59e0b;
    }

    .notification--info .notification__icon {
      color: #3b82f6;
    }

    .notification__content {
      flex: 1;
      min-width: 0;
    }

    .notification__title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
      color: #1f2937;
    }

    .notification__message {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .notification__actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .notification__close {
      position: absolute;
      top: 8px;
      left: 8px;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .notification__close:hover {
      background: #f3f4f6;
      color: #6b7280;
    }

    .btn {
      padding: 6px 12px;
      border-radius: 4px;
      border: none;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn--sm {
      padding: 4px 8px;
      font-size: 11px;
    }

    .btn--primary {
      background: #3b82f6;
      color: white;
    }

    .btn--primary:hover {
      background: #2563eb;
    }

    .btn--secondary {
      background: #e5e7eb;
      color: #374151;
    }

    .btn--secondary:hover {
      background: #d1d5db;
    }

    .btn--danger {
      background: #ef4444;
      color: white;
    }

    .btn--danger:hover {
      background: #dc2626;
    }

    /* RTL Support */
    [dir="rtl"] .notification-container {
      right: 20px;
      left: auto;
    }

    [dir="rtl"] .notification {
      border-right: none;
      border-left: 4px solid;
    }

    [dir="rtl"] .notification--success {
      border-left-color: #10b981;
    }

    [dir="rtl"] .notification--error {
      border-left-color: #ef4444;
    }

    [dir="rtl"] .notification--warning {
      border-left-color: #f59e0b;
    }

    [dir="rtl"] .notification--info {
      border-left-color: #3b82f6;
    }

    [dir="rtl"] .notification__close {
      right: 8px;
      left: auto;
    }

    /* Mobile responsiveness */
    @media (max-width: 640px) {
      .notification-container {
        left: 10px;
        right: 10px;
        max-width: none;
        width: auto;
      }

      [dir="rtl"] .notification-container {
        left: 10px;
        right: 10px;
      }

      .notification {
        padding: 12px;
        margin-bottom: 8px;
      }

      .notification__message {
        font-size: 12px;
      }
    }
  `],
  animations: [
    // You can add Angular animations here if needed
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  executeAction(action: any, notificationId: string): void {
    action.action();
    this.notificationService.remove(notificationId);
  }

  trackByNotification(index: number, notification: Notification): string {
    return notification.id;
  }
}

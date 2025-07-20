import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

interface ChatMessage {
  id: string;
  content: string;
  sender: any;
  message_type: string;
  created_at: string;
  is_own_message: boolean;
}

interface ChatSession {
  id: string;
  status: string;
  customer_name: string;
  agent: any;
  unread_messages_count: number;
}

interface SupportStatus {
  is_online: boolean;
  online_agents: number;
  available_agents: number;
  estimated_wait_time: number;
  welcome_message: string;
  offline_message: string;
  is_24_7: boolean;
}

@Component({
  selector: 'app-live-chat',
  template: `
    <!-- Chat Widget Button -->
    <div class="fixed bottom-6 left-6 z-50" *ngIf="!isVisible">
      <button 
        (click)="toggleChat()"
        class="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        [class.animate-pulse]="hasUnreadMessages">
        
        <!-- Online/Offline Indicator -->
        <div class="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white"
             [class.bg-green-500]="supportStatus?.is_online"
             [class.bg-red-500]="!supportStatus?.is_online">
        </div>
        
        <!-- Unread Messages Badge -->
        <div *ngIf="unreadCount > 0" 
             class="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {{unreadCount > 9 ? '9+' : unreadCount}}
        </div>
        
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 3.582-8 8-8s8 3.582 8 8z">
          </path>
        </svg>
        
        <!-- Tooltip -->
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {{supportStatus?.is_online ? 'چت با پشتیبانی' : 'پشتیبانی آفلاین'}}
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </button>
    </div>

    <!-- Chat Window -->
    <div *ngIf="isVisible" 
         class="fixed bottom-6 left-6 w-96 h-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-200 flex flex-col"
         [@slideIn]>
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div class="flex items-center space-x-3 space-x-reverse">
          <!-- Status Indicator -->
          <div class="w-3 h-3 rounded-full"
               [class.bg-green-400]="supportStatus?.is_online"
               [class.bg-red-400]="!supportStatus?.is_online"
               [class.animate-pulse]="supportStatus?.is_online">
          </div>
          
          <div>
            <h3 class="font-semibold">پشتیبانی آنلاین</h3>
            <p class="text-xs opacity-90">
              <span *ngIf="supportStatus?.is_online">
                {{supportStatus?.available_agents}} پشتیبان آنلاین
              </span>
              <span *ngIf="!supportStatus?.is_online">
                در حال حاضر آفلاین
              </span>
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button (click)="minimizeChat()" class="text-white hover:bg-white/20 rounded-full p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
            </svg>
          </button>
          <button (click)="closeChat()" class="text-white hover:bg-white/20 rounded-full p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Content -->
      <div class="flex-1 flex flex-col">
        <!-- No Session State -->
        <div *ngIf="!currentSession" class="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <div class="mb-4">
            <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 3.582-8 8-8s8 3.582 8 8z">
              </path>
            </svg>
          </div>
          
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            {{supportStatus?.is_online ? 'شروع گفتگو' : 'پشتیبانی آفلاین'}}
          </h4>
          
          <p class="text-sm text-gray-600 mb-4">
            {{supportStatus?.is_online ? supportStatus?.welcome_message : supportStatus?.offline_message}}
          </p>
          
          <div *ngIf="supportStatus?.is_online && supportStatus?.estimated_wait_time > 1" 
               class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
            زمان تخمینی انتظار: {{supportStatus?.estimated_wait_time}} دقیقه
          </div>
          
          <button *ngIf="supportStatus?.is_online" 
                  (click)="startChat()" 
                  [disabled]="isStartingChat"
                  class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50">
            <span *ngIf="!isStartingChat">شروع گفتگو</span>
            <span *ngIf="isStartingChat">در حال اتصال...</span>
          </button>
          
          <div *ngIf="!supportStatus?.is_online" class="space-y-2">
            <p class="text-xs text-gray-500">
              پشتیبانی ما از {{supportStatus?.is_24_7 ? '24 ساعت شبانه‌روز' : 'ساعات اداری'}} در خدمت شماست
            </p>
            <button class="text-blue-600 hover:text-blue-800 text-sm underline">
              ارسال پیام آفلاین
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div *ngIf="currentSession" class="flex-1 flex flex-col">
          <!-- Messages Container -->
          <div #messagesContainer 
               class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            
            <div *ngFor="let message of messages" 
                 class="flex"
                 [class.justify-end]="message.is_own_message"
                 [class.justify-start]="!message.is_own_message">
              
              <div class="max-w-xs lg:max-w-md">
                <!-- System Message -->
                <div *ngIf="message.message_type === 'system'" 
                     class="text-center text-xs text-gray-500 bg-gray-200 rounded-full px-3 py-1">
                  {{message.content}}
                </div>
                
                <!-- User/Agent Message -->
                <div *ngIf="message.message_type !== 'system'" 
                     class="rounded-2xl px-4 py-2"
                     [class.bg-blue-500]="message.is_own_message"
                     [class.text-white]="message.is_own_message"
                     [class.bg-white]="!message.is_own_message"
                     [class.text-gray-800]="!message.is_own_message"
                     [class.shadow-sm]="!message.is_own_message">
                  
                  <!-- Sender Name -->
                  <div *ngIf="!message.is_own_message" class="text-xs opacity-75 mb-1">
                    {{message.sender.first_name || message.sender.username}}
                  </div>
                  
                  <!-- Message Content -->
                  <div class="text-sm">{{message.content}}</div>
                  
                  <!-- Timestamp -->
                  <div class="text-xs opacity-75 mt-1">
                    {{formatTime(message.created_at)}}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Typing Indicator -->
            <div *ngIf="isAgentTyping" class="flex justify-start">
              <div class="bg-white rounded-2xl px-4 py-2 shadow-sm">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex space-x-2 space-x-reverse">
              <input #messageInput
                     [(ngModel)]="newMessage"
                     (keydown.enter)="sendMessage()"
                     (input)="onTyping()"
                     placeholder="پیام خود را بنویسید..."
                     class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                     [disabled]="isSending">
              
              <button (click)="sendMessage()" 
                      [disabled]="!newMessage.trim() || isSending"
                      class="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg *ngIf="!isSending" class="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                <div *ngIf="isSending" class="w-5 h-5">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              </button>
            </div>
            
            <!-- Session Actions -->
            <div class="flex justify-between items-center mt-2 text-xs">
              <div class="text-gray-500">
                <span *ngIf="currentSession?.agent">
                  در حال گفتگو با {{currentSession.agent.user.first_name || currentSession.agent.user.username}}
                </span>
                <span *ngIf="!currentSession?.agent && currentSession?.status === 'waiting'">
                  در انتظار اتصال پشتیبان...
                </span>
              </div>
              
              <button (click)="endChat()" 
                      class="text-red-500 hover:text-red-700">
                پایان گفتگو
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Permission Request -->
    <div *ngIf="showNotificationRequest" 
         class="fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 max-w-sm">
      <div class="flex items-start space-x-3 space-x-reverse">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3-4h.01M9 17h.01M9 14h.01M9 11h.01"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-gray-800">اعلان‌های چت</h4>
          <p class="text-xs text-gray-600 mt-1">
            برای دریافت اعلان پیام‌های جدید، اجازه نمایش اعلان‌ها را بدهید
          </p>
          <div class="flex space-x-2 space-x-reverse mt-3">
            <button (click)="requestNotificationPermission()" 
                    class="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
              اجازه می‌دهم
            </button>
            <button (click)="dismissNotificationRequest()" 
                    class="text-gray-500 hover:text-gray-700 text-xs">
              نه، متشکرم
            </button>
          </div>
        </div>
        <button (click)="dismissNotificationRequest()" 
                class="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    .animate-bounce {
      animation: bounce 1.4s infinite ease-in-out both;
    }

    /* Custom scrollbar */
    .overflow-y-auto::-webkit-scrollbar {
      width: 4px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1;
    }
  `],
  animations: [
    // Add Angular animations here if needed
  ]
})
export class LiveChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // Component state
  isVisible = false;
  isMinimized = false;
  supportStatus: SupportStatus | null = null;
  currentSession: ChatSession | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  unreadCount = 0;
  hasUnreadMessages = false;

  // Loading states
  isStartingChat = false;
  isSending = false;
  isAgentTyping = false;

  // Notification
  showNotificationRequest = false;
  notificationPermission = 'default';

  // Subscriptions
  private statusCheckSubscription: Subscription | null = null;
  private messagePollingSubscription: Subscription | null = null;
  private typingTimeout: any;

  // API endpoints
  private apiBase = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.checkSupportStatus();
    this.startStatusPolling();
    this.checkNotificationPermission();
  }

  ngOnDestroy() {
    if (this.statusCheckSubscription) {
      this.statusCheckSubscription.unsubscribe();
    }
    if (this.messagePollingSubscription) {
      this.messagePollingSubscription.unsubscribe();
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  // Support status methods
  checkSupportStatus() {
    this.http.get<SupportStatus>(`${this.apiBase}/api/chat/status/`).subscribe({
      next: (status) => {
        this.supportStatus = status;
      },
      error: (error) => {
        console.error('Error checking support status:', error);
      }
    });
  }

  startStatusPolling() {
    // Check support status every 30 seconds
    this.statusCheckSubscription = interval(30000).subscribe(() => {
      this.checkSupportStatus();
    });
  }

  // Chat control methods
  toggleChat() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.markMessagesAsRead();
    }
  }

  minimizeChat() {
    this.isVisible = false;
    this.isMinimized = true;
  }

  closeChat() {
    this.isVisible = false;
    this.isMinimized = false;
    if (this.messagePollingSubscription) {
      this.messagePollingSubscription.unsubscribe();
    }
  }

  // Chat session methods
  startChat() {
    this.isStartingChat = true;
    
    const chatData = {
      subject: 'درخواست پشتیبانی',
      priority: 'normal'
    };

    this.http.post<any>(`${this.apiBase}/api/chat/start/`, chatData).subscribe({
      next: (response) => {
        this.currentSession = response.session;
        this.isStartingChat = false;
        this.loadMessages();
        this.startMessagePolling();
      },
      error: (error) => {
        console.error('Error starting chat:', error);
        this.isStartingChat = false;
      }
    });
  }

  endChat() {
    if (!this.currentSession) return;

    const confirmEnd = confirm('آیا مطمئن هستید که می‌خواهید گفتگو را پایان دهید؟');
    if (!confirmEnd) return;

    this.http.post(`${this.apiBase}/api/chat/sessions/${this.currentSession.id}/close/`, {}).subscribe({
      next: () => {
        this.currentSession = null;
        this.messages = [];
        if (this.messagePollingSubscription) {
          this.messagePollingSubscription.unsubscribe();
        }
      },
      error: (error) => {
        console.error('Error ending chat:', error);
      }
    });
  }

  // Message methods
  loadMessages() {
    if (!this.currentSession) return;

    this.http.get<any>(`${this.apiBase}/api/chat/sessions/${this.currentSession.id}/messages/`).subscribe({
      next: (response) => {
        this.messages = response.messages;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.currentSession || this.isSending) return;

    this.isSending = true;
    const messageData = {
      session_id: this.currentSession.id,
      content: this.newMessage.trim(),
      message_type: 'text'
    };

    this.http.post<any>(`${this.apiBase}/api/chat/send/`, messageData).subscribe({
      next: (response) => {
        this.messages.push(response.message);
        this.newMessage = '';
        this.isSending = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.isSending = false;
      }
    });
  }

  onTyping() {
    // Implement typing indicator logic
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    this.typingTimeout = setTimeout(() => {
      // Send typing stopped signal
    }, 1000);
  }

  startMessagePolling() {
    // Poll for new messages every 2 seconds
    this.messagePollingSubscription = interval(2000).subscribe(() => {
      if (this.currentSession) {
        this.loadMessages();
      }
    });
  }

  markMessagesAsRead() {
    this.unreadCount = 0;
    this.hasUnreadMessages = false;
  }

  // Utility methods
  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Notification methods
  checkNotificationPermission() {
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission;
      if (this.notificationPermission === 'default') {
        // Show notification request after a delay
        setTimeout(() => {
          this.showNotificationRequest = true;
        }, 5000);
      }
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        this.notificationPermission = permission;
        this.showNotificationRequest = false;
        
        if (permission === 'granted') {
          this.registerPushToken();
        }
      });
    }
  }

  dismissNotificationRequest() {
    this.showNotificationRequest = false;
  }

  registerPushToken() {
    // Register for push notifications
    // This would integrate with a service worker for web push notifications
    const token = this.generatePushToken();
    
    this.http.post(`${this.apiBase}/api/chat/push/register/`, { token }).subscribe({
      next: () => {
        console.log('Push token registered successfully');
      },
      error: (error) => {
        console.error('Error registering push token:', error);
      }
    });
  }

  private generatePushToken(): string {
    // Generate a unique token for this browser session
    return 'web_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  showNotification(title: string, body: string) {
    if (this.notificationPermission === 'granted' && !this.isVisible) {
      const notification = new Notification(title, {
        body,
        icon: '/assets/icons/chat-icon.png',
        badge: '/assets/icons/badge.png',
        tag: 'chat-message'
      });

      notification.onclick = () => {
        window.focus();
        this.toggleChat();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }
}

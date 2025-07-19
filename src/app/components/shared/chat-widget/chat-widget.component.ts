import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { StoreService } from '../../../services/store.service';
import { ChatMessage, ChatSession, ChatSettings } from '../../../models/store.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-widget',
  template: `
    <div class="chat-widget" [class.minimized]="isMinimized" dir="rtl">
      <!-- Chat Toggle Button -->
      <button 
        *ngIf="isMinimized" 
        (click)="toggleChat()"
        class="chat-toggle-btn"
        [style.background-color]="chatSettings?.appearance?.primaryColor || '#3B82F6'">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
        </svg>
        <!-- Unread Messages Badge -->
        <span *ngIf="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </button>

      <!-- Chat Window -->
      <div *ngIf="!isMinimized" class="chat-window">
        <!-- Chat Header -->
        <div class="chat-header" [style.background-color]="chatSettings?.appearance?.primaryColor || '#3B82F6'">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 space-x-reverse">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-white text-sm font-medium">پشتیبانی آنلاین</h3>
                <p class="text-white text-opacity-70 text-xs">
                  {{ isAgentOnline ? 'آنلاین' : 'آفلاین' }}
                </p>
              </div>
            </div>
            <button (click)="toggleChat()" class="text-white hover:text-gray-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Welcome Message -->
        <div *ngIf="!currentSession && !isConnecting" class="chat-welcome">
          <div class="p-4 text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
              </svg>
            </div>
            <h4 class="text-gray-900 font-medium mb-2">
              {{ chatSettings?.appearance?.welcomeMessage || 'سلام! چطور می‌تونم کمکتون کنم؟' }}
            </h4>
            <form (ngSubmit)="startChat()" #chatForm="ngForm" class="space-y-3">
              <input
                type="text"
                [(ngModel)]="customerInfo.name"
                name="name"
                required
                placeholder="نام شما"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <input
                type="email"
                [(ngModel)]="customerInfo.email"
                name="email"
                placeholder="ایمیل (اختیاری)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <button
                type="submit"
                [disabled]="!chatForm.form.valid || isConnecting"
                class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                شروع گفتگو
              </button>
            </form>
          </div>
        </div>

        <!-- Chat Messages -->
        <div *ngIf="currentSession" class="chat-messages" #messagesContainer>
          <div class="p-4 space-y-3">
            <div *ngFor="let message of messages" 
                 class="message"
                 [class.message-sent]="message.senderType === 'customer'"
                 [class.message-received]="message.senderType !== 'customer'">
              
              <!-- System Message -->
              <div *ngIf="message.type === 'system'" class="text-center">
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {{ message.content }}
                </span>
              </div>
              
              <!-- Regular Message -->
              <div *ngIf="message.type !== 'system'" class="message-bubble">
                <!-- Text Content -->
                <div *ngIf="message.type === 'text'" class="message-text">
                  {{ message.content }}
                </div>
                
                <!-- Image Content -->
                <div *ngIf="message.type === 'image'" class="message-image">
                  <img [src]="message.content" [alt]="message.content" class="max-w-full rounded">
                </div>
                
                <!-- File Content -->
                <div *ngIf="message.type === 'file'" class="message-file">
                  <a [href]="message.content" target="_blank" class="flex items-center space-x-2 space-x-reverse">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm">فایل ضمیمه</span>
                  </a>
                </div>
                
                <!-- Message Info -->
                <div class="message-info">
                  <span class="message-time">
                    {{ chatService.getTimeAgo(message.sentAt) }}
                  </span>
                  <span *ngIf="message.senderType === 'customer' && message.status" 
                        class="message-status"
                        [class.status-read]="message.status === 'read'"
                        [class.status-delivered]="message.status === 'delivered'">
                    <svg *ngIf="message.status === 'sent'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <svg *ngIf="message.status === 'delivered'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <svg *ngIf="message.status === 'read'" class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Typing Indicator -->
            <div *ngIf="isAgentTyping" class="message message-received">
              <div class="message-bubble typing-indicator">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div *ngIf="currentSession" class="chat-input">
          <form (ngSubmit)="sendMessage()" class="flex items-end space-x-2 space-x-reverse p-3">
            <!-- File Upload -->
            <input type="file" (change)="onFileSelect($event)" #fileInput class="hidden" 
                   [accept]="allowedFileTypes">
            <button type="button" (click)="fileInput.click()" 
                    class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
            
            <!-- Message Input -->
            <div class="flex-1">
              <textarea
                [(ngModel)]="newMessage"
                name="message"
                rows="1"
                [placeholder]="chatSettings?.appearance?.placeholder || 'پیام خود را بنویسید...'"
                (keydown.enter)="onEnterKey($event)"
                (input)="onTyping()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                #messageInput></textarea>
              
              <!-- Selected File Preview -->
              <div *ngIf="selectedFile" class="mt-2 flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>{{ selectedFile.name }}</span>
                <button type="button" (click)="removeSelectedFile()" class="text-red-500 hover:text-red-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Send Button -->
            <button 
              type="submit" 
              [disabled]="!newMessage.trim() && !selectedFile || isSending"
              class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg *ngIf="!isSending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <svg *ngIf="isSending" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      direction: rtl;
    }
    
    .chat-widget.minimized {
      width: auto;
      height: auto;
    }
    
    .chat-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      position: relative;
      transition: all 0.3s ease;
    }
    
    .chat-toggle-btn:hover {
      transform: scale(1.05);
    }
    
    .unread-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #EF4444;
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
    
    .chat-window {
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .chat-header {
      padding: 16px;
      color: white;
    }
    
    .chat-welcome {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      background: #F9FAFB;
    }
    
    .message {
      margin-bottom: 12px;
    }
    
    .message-sent {
      display: flex;
      justify-content: flex-end;
    }
    
    .message-received {
      display: flex;
      justify-content: flex-start;
    }
    
    .message-bubble {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      position: relative;
    }
    
    .message-sent .message-bubble {
      background: #3B82F6;
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .message-received .message-bubble {
      background: white;
      color: #1F2937;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .message-info {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      opacity: 0.7;
    }
    
    .message-sent .message-info {
      justify-content: flex-end;
      gap: 4px;
    }
    
    .message-status.status-read {
      color: #3B82F6;
    }
    
    .chat-input {
      border-top: 1px solid #E5E7EB;
      background: white;
    }
    
    .typing-indicator {
      background: white !important;
      color: #6B7280 !important;
    }
    
    .typing-dots {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .typing-dots span {
      width: 6px;
      height: 6px;
      background: currentColor;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }
    
    @media (max-width: 768px) {
      .chat-widget {
        bottom: 10px;
        right: 10px;
        left: 10px;
      }
      
      .chat-window {
        width: 100%;
        height: 400px;
      }
    }
  `]
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  isMinimized = true;
  isConnecting = false;
  isSending = false;
  isAgentOnline = false;
  isAgentTyping = false;
  unreadCount = 0;
  
  currentSession: ChatSession | null = null;
  messages: ChatMessage[] = [];
  chatSettings: ChatSettings | null = null;
  
  newMessage = '';
  selectedFile: File | null = null;
  allowedFileTypes = 'image/*,.pdf,.doc,.docx,.txt';
  
  customerInfo = {
    name: '',
    email: '',
    phone: ''
  };
  
  private subscriptions: Subscription[] = [];
  private typingTimeout: any;

  constructor(
    public chatService: ChatService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.loadChatSettings();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.disconnectFromChat();
  }

  private loadChatSettings(): void {
    this.storeService.currentStore$.subscribe(store => {
      if (store && store.settings.features.enableLiveChat) {
        this.chatService.getChatSettings(store.id).subscribe(settings => {
          this.chatSettings = settings;
        });
      }
    });
  }

  private setupSubscriptions(): void {
    // Messages subscription
    this.subscriptions.push(
      this.chatService.messages$.subscribe(messages => {
        this.messages = messages;
        this.scrollToBottom();
        this.updateUnreadCount();
      })
    );

    // Active session subscription
    this.subscriptions.push(
      this.chatService.activeSession$.subscribe(session => {
        this.currentSession = session;
      })
    );
  }

  toggleChat(): void {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      this.unreadCount = 0;
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  startChat(): void {
    this.storeService.currentStore$.subscribe(store => {
      if (store) {
        this.isConnecting = true;
        this.chatService.startChatSession(store.id, this.customerInfo).subscribe({
          next: (session) => {
            this.currentSession = session;
            this.chatService.connectToChat(session.id);
            this.isConnecting = false;
            this.scrollToBottom();
          },
          error: (error) => {
            console.error('Error starting chat session:', error);
            this.isConnecting = false;
          }
        });
      }
    });
  }

  sendMessage(): void {
    if ((!this.newMessage.trim() && !this.selectedFile) || this.isSending || !this.currentSession) {
      return;
    }

    this.isSending = true;
    const content = this.newMessage.trim();
    const attachments = this.selectedFile ? [this.selectedFile] : undefined;

    this.chatService.sendMessage(this.currentSession.id, content, attachments).subscribe({
      next: (message) => {
        this.newMessage = '';
        this.selectedFile = null;
        this.isSending = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.isSending = false;
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.chatService.isValidFileType(file)) {
        if (file.size <= this.chatService.getMaxFileSize()) {
          this.selectedFile = file;
        } else {
          alert(`حجم فایل نباید بیشتر از ${this.chatService.formatFileSize(this.chatService.getMaxFileSize())} باشد`);
        }
      } else {
        alert('نوع فایل پشتیبانی نمی‌شود');
      }
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  onEnterKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onTyping(): void {
    if (this.currentSession) {
      this.chatService.sendTypingIndicator(this.currentSession.id);
      
      // Stop typing after 2 seconds of inactivity
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        if (this.currentSession) {
          this.chatService.stopTypingIndicator(this.currentSession.id);
        }
      }, 2000);
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  private updateUnreadCount(): void {
    if (this.isMinimized) {
      const unreadMessages = this.messages.filter(msg => 
        msg.senderType !== 'customer' && msg.status !== 'read'
      );
      this.unreadCount = unreadMessages.length;
    }
  }
}

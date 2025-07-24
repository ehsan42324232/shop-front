import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  message: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file' | 'system';
}

interface ChatAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  department: string;
}

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss']
})
export class LiveChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private destroy$ = new Subject<void>();
  
  // Chat state
  isOpen = false;
  isMinimized = false;
  isConnected = false;
  isTyping = false;
  
  // Chat data
  messages: ChatMessage[] = [];
  currentMessage = '';
  chatSession: any = null;
  agent: ChatAgent | null = null;
  
  // UI state
  showEmojiPicker = false;
  showQuickReplies = true;
  unreadCount = 0;
  
  // Quick replies
  quickReplies = [
    { text: 'سلام، نیاز به کمک دارم', value: 'سلام، نیاز به کمک دارم' },
    { text: 'پیگیری سفارش', value: 'می‌خواهم سفارشم را پیگیری کنم' },
    { text: 'مشکل در پرداخت', value: 'در پرداخت با مشکل مواجه شدم' },
    { text: 'استرداد کالا', value: 'نحوه استرداد کالا چیست؟' }
  ];
  
  // Emoji list
  emojis = ['😊', '😢', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉'];

  constructor() {}

  ngOnInit(): void {
    this.initializeChat();
    this.loadChatHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnectChat();
  }

  initializeChat(): void {
    // Initialize WebSocket connection for real-time chat
    // This would connect to your Django Channels WebSocket
    this.connectToWebSocket();
    
    // Add system welcome message
    this.addSystemMessage('سلام! چطور می‌تونم کمکتون کنم؟');
  }

  connectToWebSocket(): void {
    // WebSocket connection logic would go here
    // For now, simulate connection
    setTimeout(() => {
      this.isConnected = true;
      this.assignAgent();
    }, 1000);
  }

  disconnectChat(): void {
    // Cleanup WebSocket connection
    this.isConnected = false;
  }

  assignAgent(): void {
    // Simulate agent assignment
    this.agent = {
      id: 'agent-1',
      name: 'مریم احمدی',
      avatar: '/assets/images/agent-avatar.jpg',
      status: 'online',
      department: 'پشتیبانی فروش'
    };
    
    this.addSystemMessage(`${this.agent.name} از ${this.agent.department} به شما متصل شد.`);
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.isMinimized = false;
    
    if (this.isOpen) {
      this.markMessagesAsRead();
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  minimizeChat(): void {
    this.isMinimized = true;
  }

  maximizeChat(): void {
    this.isMinimized = false;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  closeChat(): void {
    this.isOpen = false;
    this.isMinimized = false;
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;
    
    const message: ChatMessage = {
      id: this.generateId(),
      sender: 'customer',
      message: this.currentMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      messageType: 'text'
    };
    
    this.messages.push(message);
    this.currentMessage = '';
    this.scrollToBottom();
    
    // Simulate agent typing and response
    this.simulateAgentResponse();
  }

  sendQuickReply(reply: string): void {
    this.currentMessage = reply;
    this.sendMessage();
    this.showQuickReplies = false;
  }

  simulateAgentResponse(): void {
    this.isTyping = true;
    
    setTimeout(() => {
      const responses = [
        'ممنون از پیامتون. در حال بررسی هستم...',
        'بله، در خدمت شما هستم. لطفا شرح کاملی از مشکل بدید.',
        'حتما کمکتون می‌کنم. چند لحظه صبر کنید.',
        'اطلاعات شما را دریافت کردم. در حال پیگیری هستم.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const message: ChatMessage = {
        id: this.generateId(),
        sender: 'agent',
        message: randomResponse,
        timestamp: new Date(),
        isRead: false,
        messageType: 'text'
      };
      
      this.messages.push(message);
      this.isTyping = false;
      
      if (!this.isOpen) {
        this.unreadCount++;
      }
      
      this.scrollToBottom();
    }, 1500 + Math.random() * 1000);
  }

  handleFileUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size and type
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (file.size > maxSize) {
      alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert('فقط فایل‌های تصویری و PDF مجاز هستند');
      return;
    }
    
    // Upload file and send message
    this.uploadFile(file);
  }

  uploadFile(file: File): void {
    // Simulate file upload
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const message: ChatMessage = {
        id: this.generateId(),
        sender: 'customer',
        message: file.name,
        timestamp: new Date(),
        isRead: false,
        messageType: file.type.startsWith('image/') ? 'image' : 'file'
      };
      
      this.messages.push(message);
      this.scrollToBottom();
    };
    
    reader.readAsDataURL(file);
  }

  addEmoji(emoji: string): void {
    this.currentMessage += emoji;
    this.showEmojiPicker = false;
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addSystemMessage(message: string): void {
    const systemMessage: ChatMessage = {
      id: this.generateId(),
      sender: 'system',
      message: message,
      timestamp: new Date(),
      isRead: true,
      messageType: 'system'
    };
    
    this.messages.push(systemMessage);
    this.scrollToBottom();
  }

  markMessagesAsRead(): void {
    this.messages.forEach(msg => {
      if (msg.sender === 'agent') {
        msg.isRead = true;
      }
    });
    this.unreadCount = 0;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  loadChatHistory(): void {
    // Load previous chat messages from API
    // This would call your Django API to get chat history
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return 'همین الان';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} دقیقه پیش`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} ساعت پیش`;
    } else {
      return timestamp.toLocaleDateString('fa-IR');
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  getMessageClass(message: ChatMessage): string {
    const baseClass = 'message';
    return `${baseClass} ${baseClass}--${message.sender}`;
  }

  getAgentStatusClass(): string {
    if (!this.agent) return 'offline';
    return this.agent.status;
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Utility methods
  isImageMessage(message: ChatMessage): boolean {
    return message.messageType === 'image';
  }

  isFileMessage(message: ChatMessage): boolean {
    return message.messageType === 'file';
  }

  isSystemMessage(message: ChatMessage): boolean {
    return message.messageType === 'system';
  }

  startNewConversation(): void {
    this.messages = [];
    this.addSystemMessage('مکالمه جدید شروع شد. چطور می‌تونم کمکتون کنم؟');
    this.showQuickReplies = true;
  }

  downloadChatHistory(): void {
    // Create and download chat history as text file
    const chatHistory = this.messages
      .filter(msg => msg.messageType !== 'system')
      .map(msg => {
        const time = msg.timestamp.toLocaleTimeString('fa-IR');
        const sender = msg.sender === 'customer' ? 'شما' : this.agent?.name || 'پشتیبان';
        return `[${time}] ${sender}: ${msg.message}`;
      })
      .join('\n');

    const blob = new Blob([chatHistory], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().toLocaleDateString('fa-IR')}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  rateChatExperience(rating: number): void {
    // Send rating to backend
    console.log('Chat rated:', rating);
    this.addSystemMessage(`ممنون از امتیاز ${rating} ستاره‌ای شما!`);
  }

  requestHumanAgent(): void {
    this.addSystemMessage('درخواست شما برای اتصال به پشتیبان انسانی ثبت شد. لطفا کمی صبر کنید...');
    
    // Simulate human agent assignment
    setTimeout(() => {
      this.agent = {
        id: 'human-agent-1',
        name: 'احمد رضایی',
        avatar: '/assets/images/human-agent-avatar.jpg',
        status: 'online',
        department: 'پشتیبانی تخصصی'
      };
      
      this.addSystemMessage(`${this.agent.name} از ${this.agent.department} به شما متصل شد.`);
    }, 3000);
  }

  shareLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          const message: ChatMessage = {
            id: this.generateId(),
            sender: 'customer',
            message: `موقعیت مکانی: ${lat}, ${lng}`,
            timestamp: new Date(),
            isRead: false,
            messageType: 'text'
          };
          
          this.messages.push(message);
          this.scrollToBottom();
        },
        (error) => {
          alert('امکان دسترسی به موقعیت مکانی وجود ندارد');
        }
      );
    } else {
      alert('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
    }
  }

  copyMessageToClipboard(message: string): void {
    navigator.clipboard.writeText(message).then(() => {
      // Show success toast or notification
      console.log('Message copied to clipboard');
    });
  }

  reportMessage(messageId: string): void {
    // Report inappropriate message
    console.log('Message reported:', messageId);
    this.addSystemMessage('پیام شما گزارش شد و توسط تیم پشتیبانی بررسی خواهد شد.');
  }

  blockAgent(): void {
    // Block current agent
    if (this.agent) {
      console.log('Agent blocked:', this.agent.id);
      this.addSystemMessage('پشتیبان مسدود شد. در حال اتصال به پشتیبان جدید...');
      
      setTimeout(() => {
        this.assignAgent();
      }, 2000);
    }
  }

  getSatisfactionEmoji(rating: number): string {
    const emojis = ['😞', '😐', '🙂', '😊', '😍'];
    return emojis[rating - 1] || '😐';
  }

  scheduleCallback(): void {
    // Open callback scheduling modal
    this.addSystemMessage('لطفا شماره تماس و زمان مناسب برای تماس را در فرم مربوطه وارد کنید.');
  }

  getEstimatedWaitTime(): string {
    // Calculate estimated wait time based on queue
    const waitMinutes = Math.floor(Math.random() * 10) + 1;
    return `حدود ${waitMinutes} دقیقه`;
  }

  getAvailableAgents(): number {
    // Get number of available agents
    return Math.floor(Math.random() * 5) + 1;
  }

  isBusinessHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour <= 22; // 8 AM to 10 PM
  }

  getBusinessHoursMessage(): string {
    return 'ساعات کاری: شنبه تا پنج‌شنبه، 8 صبح تا 10 شب';
  }
}

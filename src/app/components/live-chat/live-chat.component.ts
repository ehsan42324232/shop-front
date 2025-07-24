import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  id: number;
  sender_type: 'customer' | 'store_owner';
  sender_name: string;
  message: string;
  message_type: 'text' | 'image' | 'file';
  timestamp: string;
  is_read: boolean;
}

interface ChatRoom {
  id: number;
  customer_name: string;
  customer_phone: string;
  status: 'active' | 'closed' | 'transferred';
  last_activity: string;
  unread_count: number;
}

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent implements OnInit {
  @Input() storeId: number | null = null;
  @Input() isCustomerView = false;
  @Output() onChatClosed = new EventEmitter<number>();

  // State
  currentView: 'rooms' | 'chat' = 'rooms';
  loading = false;
  connecting = false;
  error: string | null = null;

  // Chat rooms (for store owners)
  chatRooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;

  // Messages
  messages: ChatMessage[] = [];
  newMessage = '';
  
  // Customer chat initiation
  customerForm = {
    name: '',
    phone: '',
    initial_message: ''
  };

  // WebSocket connection
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.isCustomerView) {
      this.currentView = 'chat';
    } else {
      this.loadChatRooms();
    }
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  // ===============================
  // Chat Rooms Management
  // ===============================

  loadChatRooms(): void {
    if (!this.storeId) return;

    this.loading = true;
    this.http.get<{success: boolean, data: any}>(`${environment.apiUrl}/api/chat/rooms/?store_id=${this.storeId}`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.chatRooms = response.data.rooms || [];
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در بارگذاری اتاق‌های چت:', error);
          this.error = 'خطا در بارگذاری فهرست چت‌ها';
          this.loading = false;
        }
      });
  }

  selectRoom(room: ChatRoom): void {
    this.selectedRoom = room;
    this.currentView = 'chat';
    this.loadMessages(room.id);
    this.connectWebSocket(room.id);
  }

  // ===============================
  // Customer Chat Initiation
  // ===============================

  initiateCustomerChat(): void {
    if (!this.storeId || !this.customerForm.name || !this.customerForm.initial_message) {
      this.error = 'لطفاً تمام فیلدهای ضروری را پر کنید';
      return;
    }

    this.loading = true;
    this.error = null;

    const payload = {
      store_id: this.storeId,
      customer_name: this.customerForm.name,
      customer_phone: this.customerForm.phone,
      initial_message: this.customerForm.initial_message
    };

    this.http.post<{success: boolean, data: any}>(`${environment.apiUrl}/api/chat/initiate/`, payload)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const roomData = response.data;
            this.selectedRoom = {
              id: roomData.chat_room_id,
              customer_name: this.customerForm.name,
              customer_phone: this.customerForm.phone,
              status: 'active',
              last_activity: new Date().toISOString(),
              unread_count: 0
            };
            
            this.connectWebSocket(roomData.chat_room_id);
            this.loadMessages(roomData.chat_room_id);
            this.resetCustomerForm();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('خطا در شروع چت:', error);
          this.error = 'خطا در شروع چت. لطفاً دوباره تلاش کنید.';
          this.loading = false;
        }
      });
  }

  resetCustomerForm(): void {
    this.customerForm = {
      name: '',
      phone: '',
      initial_message: ''
    };
  }

  // ===============================
  // Messages Management
  // ===============================

  loadMessages(roomId: number): void {
    this.http.get<{success: boolean, data: any}>(`${environment.apiUrl}/api/chat/messages/${roomId}/`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.messages = response.data.messages || [];
            this.scrollToBottom();
          }
        },
        error: (error) => {
          console.error('خطا در بارگذاری پیام‌ها:', error);
          this.error = 'خطا در بارگذاری پیام‌ها';
        }
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedRoom) return;

    const messageData = {
      message: this.newMessage.trim(),
      sender_type: this.isCustomerView ? 'customer' : 'store_owner',
      sender_name: this.isCustomerView ? this.selectedRoom.customer_name : 'فروشنده',
      message_type: 'text'
    };

    this.http.post<{success: boolean}>(`${environment.apiUrl}/api/chat/messages/${this.selectedRoom.id}/`, messageData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.newMessage = '';
            // Message will be added via WebSocket
          }
        },
        error: (error) => {
          console.error('خطا در ارسال پیام:', error);
          this.error = 'خطا در ارسال پیام';
        }
      });
  }

  // ===============================
  // WebSocket Connection
  // ===============================

  connectWebSocket(roomId: number): void {
    this.closeWebSocket();
    this.connecting = true;

    const wsUrl = `${environment.wsUrl}/ws/chat/${roomId}/`;
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.connecting = false;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.connecting = false;
        
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connectWebSocket(roomId);
          }, 3000 * this.reconnectAttempts);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connecting = false;
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.connecting = false;
    }
  }

  closeWebSocket(): void {
    if (this.ws) {
      this.ws.close(1000, 'Component destroyed');
      this.ws = null;
    }
  }

  handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'chat_message':
        this.addMessage(data.message);
        break;
      case 'status_change':
        this.updateRoomStatus(data.message);
        break;
      case 'user_typing':
        this.handleTypingIndicator(data.message);
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  addMessage(messageData: any): void {
    const message: ChatMessage = {
      id: messageData.message_id,
      sender_type: messageData.sender_type,
      sender_name: messageData.sender_name,
      message: messageData.message,
      message_type: messageData.message_type,
      timestamp: messageData.timestamp,
      is_read: false
    };

    this.messages.push(message);
    this.scrollToBottom();
  }

  updateRoomStatus(statusData: any): void {
    if (this.selectedRoom) {
      this.selectedRoom.status = statusData.new_status;
    }
  }

  handleTypingIndicator(typingData: any): void {
    // Implement typing indicator logic
    console.log('User typing:', typingData);
  }

  // ===============================
  // Room Actions
  // ===============================

  closeChat(): void {
    if (!this.selectedRoom) return;

    if (confirm('آیا از بستن این چت اطمینان دارید؟')) {
      this.http.patch(`${environment.apiUrl}/api/chat/rooms/${this.selectedRoom.id}/status/`, {
        status: 'closed',
        notes: 'بسته شده توسط کاربر'
      }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.selectedRoom!.status = 'closed';
            this.onChatClosed.emit(this.selectedRoom!.id);
            this.goBackToRooms();
          }
        },
        error: (error) => {
          console.error('خطا در بستن چت:', error);
          this.error = 'خطا در بستن چت';
        }
      });
    }
  }

  goBackToRooms(): void {
    this.currentView = 'rooms';
    this.selectedRoom = null;
    this.messages = [];
    this.closeWebSocket();
    
    if (!this.isCustomerView) {
      this.loadChatRooms();
    }
  }

  // ===============================
  // Utility Methods
  // ===============================

  scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isOwnMessage(message: ChatMessage): boolean {
    if (this.isCustomerView) {
      return message.sender_type === 'customer';
    } else {
      return message.sender_type === 'store_owner';
    }
  }

  getRoomStatusClass(status: string): string {
    const statusClasses = {
      'active': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800',
      'transferred': 'bg-blue-100 text-blue-800'
    };
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
  }

  getRoomStatusText(status: string): string {
    const statusTexts = {
      'active': 'فعال',
      'closed': 'بسته شده',
      'transferred': 'منتقل شده'
    };
    return statusTexts[status as keyof typeof statusTexts] || 'نامشخص';
  }

  onMessageKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatMessage, ChatSession, ChatSettings, ChatAnalytics } from '../models/store.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  private wsUrl = environment.wsUrl;
  
  // WebSocket connection
  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private activeSessionSubject = new BehaviorSubject<ChatSession | null>(null);
  
  public messages$ = this.messagesSubject.asObservable();
  public activeSession$ = this.activeSessionSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Chat Session Management
  startChatSession(storeId: string, customerInfo: {
    name: string;
    email?: string;
    phone?: string;
  }): Observable<ChatSession> {
    return this.http.post<ChatSession>(`${this.apiUrl}/stores/${storeId}/chat/sessions`, customerInfo);
  }

  joinChatSession(sessionId: string): Observable<ChatSession> {
    return this.http.get<ChatSession>(`${this.apiUrl}/chat/sessions/${sessionId}`);
  }

  endChatSession(sessionId: string, rating?: number, feedback?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/chat/sessions/${sessionId}/end`, {
      rating,
      feedback
    });
  }

  // Message Management
  sendMessage(sessionId: string, content: string, attachments?: File[]): Observable<ChatMessage> {
    const formData = new FormData();
    formData.append('content', content);
    
    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    return this.http.post<ChatMessage>(`${this.apiUrl}/chat/sessions/${sessionId}/messages`, formData);
  }

  getMessages(sessionId: string, page: number = 1, limit: number = 50): Observable<{
    messages: ChatMessage[];
    hasMore: boolean;
  }> {
    return this.http.get<any>(`${this.apiUrl}/chat/sessions/${sessionId}/messages`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  markMessagesAsRead(sessionId: string, messageIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/chat/sessions/${sessionId}/mark-read`, { messageIds });
  }

  // WebSocket Connection
  connectToChat(sessionId: string): void {
    if (this.socket$) {
      this.socket$.complete();
    }

    this.socket$ = webSocket({
      url: `${this.wsUrl}/chat/${sessionId}`,
      openObserver: {
        next: () => {
          console.log('Chat WebSocket connected');
        }
      },
      closeObserver: {
        next: () => {
          console.log('Chat WebSocket disconnected');
        }
      }
    });

    this.socket$.subscribe(
      (message: any) => {
        this.handleWebSocketMessage(message);
      },
      (error) => {
        console.error('Chat WebSocket error:', error);
      }
    );
  }

  disconnectFromChat(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'new_message':
        this.addMessageToList(message.data);
        break;
      case 'message_read':
        this.updateMessageStatus(message.data.messageId, 'read');
        break;
      case 'session_updated':
        this.activeSessionSubject.next(message.data);
        break;
      case 'agent_typing':
        // Handle typing indicator
        break;
    }
  }

  private addMessageToList(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private updateMessageStatus(messageId: string, status: 'sent' | 'delivered' | 'read'): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    );
    this.messagesSubject.next(updatedMessages);
  }

  // Chat Settings Management
  getChatSettings(storeId: string): Observable<ChatSettings> {
    return this.http.get<ChatSettings>(`${this.apiUrl}/stores/${storeId}/chat/settings`);
  }

  updateChatSettings(storeId: string, settings: ChatSettings): Observable<ChatSettings> {
    return this.http.put<ChatSettings>(`${this.apiUrl}/stores/${storeId}/chat/settings`, settings);
  }

  // Admin Functions
  getActiveSessions(storeId: string): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(`${this.apiUrl}/stores/${storeId}/chat/sessions/active`);
  }

  getAllSessions(storeId: string, filters?: {
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }): Observable<{
    sessions: ChatSession[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const params: any = {};
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] !== undefined) {
          params[key] = filters[key as keyof typeof filters];
        }
      });
    }

    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/chat/sessions`, { params });
  }

  assignSessionToAgent(sessionId: string, agentId: string): Observable<ChatSession> {
    return this.http.post<ChatSession>(`${this.apiUrl}/chat/sessions/${sessionId}/assign`, { agentId });
  }

  // Analytics
  getChatAnalytics(storeId: string, period: 'day' | 'week' | 'month'): Observable<ChatAnalytics> {
    return this.http.get<ChatAnalytics>(`${this.apiUrl}/stores/${storeId}/chat/analytics`, {
      params: { period }
    });
  }

  // Telegram Integration
  setupTelegramBot(storeId: string, botToken: string): Observable<{
    success: boolean;
    botInfo: any;
    webhookUrl: string;
  }> {
    return this.http.post<any>(`${this.apiUrl}/stores/${storeId}/chat/telegram/setup`, { botToken });
  }

  testTelegramConnection(storeId: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/stores/${storeId}/chat/telegram/test`, {});
  }

  // WhatsApp Integration
  setupWhatsApp(storeId: string, phoneNumber: string): Observable<{
    success: boolean;
    qrCode?: string;
    status: string;
  }> {
    return this.http.post<any>(`${this.apiUrl}/stores/${storeId}/chat/whatsapp/setup`, { phoneNumber });
  }

  getWhatsAppStatus(storeId: string): Observable<{
    connected: boolean;
    phoneNumber?: string;
    status: string;
  }> {
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/chat/whatsapp/status`);
  }

  // File Upload for Chat
  uploadChatFile(file: File): Observable<{
    success: boolean;
    fileUrl: string;
    filename: string;
    size: number;
    mimeType: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/chat/upload`, formData);
  }

  // Typing Indicators
  sendTypingIndicator(sessionId: string): void {
    if (this.socket$) {
      this.socket$.next({
        type: 'typing',
        sessionId
      });
    }
  }

  stopTypingIndicator(sessionId: string): void {
    if (this.socket$) {
      this.socket$.next({
        type: 'stop_typing',
        sessionId
      });
    }
  }

  // Auto Reply Management
  createAutoReply(storeId: string, trigger: string, response: string): Observable<{
    id: string;
    trigger: string;
    response: string;
  }> {
    return this.http.post<any>(`${this.apiUrl}/stores/${storeId}/chat/auto-replies`, {
      trigger,
      response
    });
  }

  getAutoReplies(storeId: string): Observable<{
    id: string;
    trigger: string;
    response: string;
    enabled: boolean;
  }[]> {
    return this.http.get<any>(`${this.apiUrl}/stores/${storeId}/chat/auto-replies`);
  }

  updateAutoReply(storeId: string, replyId: string, updates: {
    trigger?: string;
    response?: string;
    enabled?: boolean;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stores/${storeId}/chat/auto-replies/${replyId}`, updates);
  }

  deleteAutoReply(storeId: string, replyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stores/${storeId}/chat/auto-replies/${replyId}`);
  }

  // Chat History Export
  exportChatHistory(storeId: string, filters: {
    dateFrom?: Date;
    dateTo?: Date;
    sessionIds?: string[];
    format: 'xlsx' | 'csv' | 'pdf';
  }): Observable<Blob> {
    const params: any = {
      format: filters.format
    };
    
    if (filters.dateFrom) params.dateFrom = filters.dateFrom.toISOString();
    if (filters.dateTo) params.dateTo = filters.dateTo.toISOString();
    if (filters.sessionIds) params.sessionIds = filters.sessionIds.join(',');

    return this.http.get(`${this.apiUrl}/stores/${storeId}/chat/export`, {
      params,
      responseType: 'blob'
    });
  }

  // Utility Methods
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'الان';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} دقیقه پیش`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ساعت پیش`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} روز پیش`;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 بایت';
    
    const k = 1024;
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    return allowedTypes.includes(file.type);
  }

  getMaxFileSize(): number {
    return 10 * 1024 * 1024; // 10 MB
  }

  // Cleanup
  ngOnDestroy(): void {
    this.disconnectFromChat();
  }
}

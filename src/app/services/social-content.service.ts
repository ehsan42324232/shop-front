import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SocialPlatform {
  id: string;
  platform_type: string;
  platform_type_display: string;
  username: string;
  is_active: boolean;
  last_sync: string | null;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  external_id: string;
  content_type: string;
  content_type_display: string;
  text_content: string;
  media_urls: string[];
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  expires_at: string | null;
  is_highlighted: boolean;
  is_processed: boolean;
  processing_error: string;
  extracted_images: any[];
  extracted_videos: any[];
  extracted_text: string;
  created_at: string;
  updated_at: string;
  platform_info: {
    type: string;
    username: string;
    display_name: string;
  };
  time_since_created: string;
}

export interface Post {
  id: string;
  external_id: string;
  content_type: string;
  content_type_display: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  media_urls: string[];
  thumbnail_url: string;
  post_url: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  save_count: number;
  published_at: string;
  location: string;
  is_processed: boolean;
  processing_error: string;
  extracted_images: any[];
  extracted_videos: any[];
  extracted_text: string;
  created_at: string;
  updated_at: string;
  platform_info: {
    type: string;
    username: string;
    display_name: string;
  };
  time_since_published: string;
  engagement_rate: number;
}

export interface ContentSelection {
  id: string;
  product: string;
  content_type: 'story' | 'post';
  content_type_display: string;
  content_id: string;
  selected_media_type: 'image' | 'video' | 'text';
  selected_media_type_display: string;
  selected_media_urls: string[];
  selected_text: string;
  use_as_product_image: boolean;
  use_in_description: boolean;
  use_as_gallery: boolean;
  selection_notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_info: {
    id: string;
    title: string;
    slug: string;
    price: number;
  };
  source_content_info: any;
}

export interface ContentSyncLog {
  id: string;
  sync_type: string;
  sync_type_display: string;
  status: string;
  status_display: string;
  total_items_found: number;
  new_items_created: number;
  items_updated: number;
  items_failed: number;
  error_details: any[];
  started_at: string;
  completed_at: string | null;
  platform_info: {
    type: string;
    username: string;
    display_name: string;
  };
  duration: string;
  success_rate: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ContentSummary {
  stories: Story[];
  posts: Post[];
  total_stories: number;
  total_posts: number;
  platforms: SocialPlatform[];
}

export interface ContentSearchParams {
  query?: string;
  content_type?: 'story' | 'post' | 'both';
  platform_type?: string;
  media_type?: 'image' | 'video' | 'text' | 'all';
  date_from?: string;
  date_to?: string;
  min_engagement?: number;
  has_hashtags?: boolean;
  limit?: number;
  offset?: number;
}

export interface SelectContentPayload {
  product_id: string;
  content_type: 'story' | 'post';
  content_id: string;
  selected_media_type: 'image' | 'video' | 'text';
  selected_media_urls?: string[];
  selected_text?: string;
  use_as_product_image?: boolean;
  use_in_description?: boolean;
  use_as_gallery?: boolean;
  selection_notes?: string;
}

export interface BulkSelectContentPayload {
  product_id: string;
  selections: SelectContentPayload[];
}

@Injectable({
  providedIn: 'root'
})
export class SocialContentService {
  private readonly baseUrl = `${environment.apiUrl}/social`;

  constructor(private http: HttpClient) {}

  // Platform management
  getPlatforms(): Observable<SocialPlatform[]> {
    return this.http.get<SocialPlatform[]>(`${this.baseUrl}/platforms/`);
  }

  createPlatform(platform: Partial<SocialPlatform>): Observable<SocialPlatform> {
    return this.http.post<SocialPlatform>(`${this.baseUrl}/platforms/`, platform);
  }

  updatePlatform(id: string, platform: Partial<SocialPlatform>): Observable<SocialPlatform> {
    return this.http.patch<SocialPlatform>(`${this.baseUrl}/platforms/${id}/`, platform);
  }

  deletePlatform(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/platforms/${id}/`);
  }

  syncPlatformContent(id: string, options: {
    content_type?: 'stories' | 'posts' | 'both';
    limit?: number;
  } = {}): Observable<{ message: string; sync_logs: ContentSyncLog[] }> {
    return this.http.post<{ message: string; sync_logs: ContentSyncLog[] }>(
      `${this.baseUrl}/platforms/${id}/sync_content/`,
      options
    );
  }

  getPlatformSyncHistory(id: string): Observable<ContentSyncLog[]> {
    return this.http.get<ContentSyncLog[]>(`${this.baseUrl}/platforms/${id}/sync_history/`);
  }

  // Stories
  getStories(params: {
    page?: number;
    page_size?: number;
    platform_type?: string;
    content_type?: string;
    search?: string;
    days_ago?: number;
    is_processed?: boolean;
  } = {}): Observable<PaginatedResponse<Story>> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Story>>(`${this.baseUrl}/stories/`, { params: httpParams });
  }

  getStory(id: string): Observable<Story> {
    return this.http.get<Story>(`${this.baseUrl}/stories/${id}/`);
  }

  extractStoryContent(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/stories/${id}/extract_content/`, {});
  }

  // Posts
  getPosts(params: {
    page?: number;
    page_size?: number;
    platform_type?: string;
    content_type?: string;
    search?: string;
    days_ago?: number;
    min_engagement?: number;
    is_processed?: boolean;
  } = {}): Observable<PaginatedResponse<Post>> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Post>>(`${this.baseUrl}/posts/`, { params: httpParams });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}/`);
  }

  extractPostContent(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/posts/${id}/extract_content/`, {});
  }

  // Content selections
  getContentSelections(params: {
    page?: number;
    page_size?: number;
    product_id?: string;
    content_type?: string;
    media_type?: string;
    usage?: 'product_image' | 'description' | 'gallery';
  } = {}): Observable<PaginatedResponse<ContentSelection>> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<ContentSelection>>(`${this.baseUrl}/selections/`, { params: httpParams });
  }

  getContentSelection(id: string): Observable<ContentSelection> {
    return this.http.get<ContentSelection>(`${this.baseUrl}/selections/${id}/`);
  }

  selectContent(payload: SelectContentPayload): Observable<ContentSelection> {
    return this.http.post<ContentSelection>(`${this.baseUrl}/selections/select_content/`, payload);
  }

  bulkSelectContent(payload: BulkSelectContentPayload): Observable<{
    message: string;
    selections: ContentSelection[];
  }> {
    return this.http.post<{
      message: string;
      selections: ContentSelection[];
    }>(`${this.baseUrl}/selections/bulk_select/`, payload);
  }

  updateContentSelection(id: string, payload: Partial<ContentSelection>): Observable<ContentSelection> {
    return this.http.patch<ContentSelection>(`${this.baseUrl}/selections/${id}/`, payload);
  }

  deleteContentSelection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/selections/${id}/`);
  }

  // Social content API
  getContentSummary(): Observable<ContentSummary> {
    return this.http.get<ContentSummary>(`${this.baseUrl}/content/summary/`);
  }

  searchContent(params: ContentSearchParams): Observable<{
    stories: Story[];
    posts: Post[];
    total_count: number;
  }> {
    return this.http.post<{
      stories: Story[];
      posts: Post[];
      total_count: number;
    }>(`${this.baseUrl}/content/search_content/`, params);
  }

  getProductContentSummary(productId: string): Observable<{
    product_id: string;
    product_title: string;
    selected_content_count: number;
    content_breakdown: any;
    recent_selections: ContentSelection[];
    suggested_content: any[];
  }> {
    const params = new HttpParams().set('product_id', productId);
    return this.http.get<{
      product_id: string;
      product_title: string;
      selected_content_count: number;
      content_breakdown: any;
      recent_selections: ContentSelection[];
      suggested_content: any[];
    }>(`${this.baseUrl}/content/product_content_summary/`, { params });
  }

  syncAllPlatforms(): Observable<{
    message: string;
    results: any[];
  }> {
    return this.http.post<{
      message: string;
      results: any[];
    }>(`${this.baseUrl}/content/sync_all_platforms/`, {});
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getPlatformDisplayName(platformType: string): string {
    const platforms: { [key: string]: string } = {
      'instagram': 'اینستاگرام',
      'telegram': 'تلگرام',
      'twitter': 'توییتر',
      'facebook': 'فیس‌بوک',
      'tiktok': 'تیک‌تاک',
      'youtube': 'یوتیوب'
    };
    return platforms[platformType] || platformType;
  }

  getContentTypeDisplayName(contentType: string): string {
    const types: { [key: string]: string } = {
      'image': 'تصویر',
      'video': 'ویدیو',
      'text': 'متن',
      'carousel': 'کاروسل',
      'mixed': 'ترکیبی'
    };
    return types[contentType] || contentType;
  }

  getMediaTypeIcon(mediaType: string): string {
    const icons: { [key: string]: string } = {
      'image': 'pi pi-image',
      'video': 'pi pi-video',
      'text': 'pi pi-file-text',
      'carousel': 'pi pi-images',
      'mixed': 'pi pi-th-large'
    };
    return icons[mediaType] || 'pi pi-file';
  }

  getPlatformIcon(platformType: string): string {
    const icons: { [key: string]: string } = {
      'instagram': 'pi pi-instagram',
      'telegram': 'pi pi-telegram',
      'twitter': 'pi pi-twitter',
      'facebook': 'pi pi-facebook',
      'tiktok': 'pi pi-video',
      'youtube': 'pi pi-youtube'
    };
    return icons[platformType] || 'pi pi-globe';
  }

  getPlatformColor(platformType: string): string {
    const colors: { [key: string]: string } = {
      'instagram': '#E4405F',
      'telegram': '#0088cc',
      'twitter': '#1DA1F2',
      'facebook': '#1877F2',
      'tiktok': '#000000',
      'youtube': '#FF0000'
    };
    return colors[platformType] || '#6c757d';
  }

  formatEngagement(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  isContentExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'همین الان';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} دقیقه پیش`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ساعت پیش`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} روز پیش`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} ماه پیش`;
    }
  }
}

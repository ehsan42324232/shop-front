import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialContentService } from '../../services/social-content.service';
import { NotificationService } from '../../services/notification.service';

interface ContentItem {
  id: string;
  type: 'story' | 'post';
  platform_info: {
    type: string;
    username: string;
    display_name: string;
  };
  extracted_images: any[];
  extracted_videos: any[];
  extracted_text: string;
  created_at: string;
  content_type: string;
  thumbnail_url?: string;
  caption?: string;
  text_content?: string;
  view_count?: number;
  like_count?: number;
  time_since_created?: string;
  time_since_published?: string;
}

interface SelectedContent {
  content_id: string;
  content_type: 'story' | 'post';
  selected_media_type: 'image' | 'video' | 'text';
  selected_media_urls: string[];
  selected_text: string;
  use_as_product_image: boolean;
  use_in_description: boolean;
  use_as_gallery: boolean;
  selection_notes: string;
}

@Component({
  selector: 'app-content-selector',
  templateUrl: './content-selector.component.html',
  styleUrls: ['./content-selector.component.scss']
})
export class ContentSelectorComponent implements OnInit {
  @Input() productId: string = '';
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() contentSelected = new EventEmitter<SelectedContent[]>();

  stories: ContentItem[] = [];
  posts: ContentItem[] = [];
  loading: boolean = false;
  selectedItems: SelectedContent[] = [];
  
  // Filters
  filterForm: FormGroup;
  platforms: any[] = [];
  contentTypes = [
    { value: 'both', label: 'همه محتوا' },
    { value: 'story', label: 'استوری‌ها' },
    { value: 'post', label: 'پست‌ها' }
  ];
  mediaTypes = [
    { value: 'all', label: 'همه رسانه‌ها' },
    { value: 'image', label: 'تصاویر' },
    { value: 'video', label: 'ویدیوها' },
    { value: 'text', label: 'متن' }
  ];
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalItems = 0;
  
  // Selection modal
  showSelectionModal = false;
  currentContent: ContentItem | null = null;
  selectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private socialContentService: SocialContentService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      content_type: ['both'],
      platform_type: ['all'],
      media_type: ['all'],
      search: [''],
      days_ago: [7]
    });
    
    this.selectionForm = this.fb.group({
      selected_media_type: ['image', Validators.required],
      selected_media_urls: [[]],
      selected_text: [''],
      use_as_product_image: [false],
      use_in_description: [false],
      use_as_gallery: [true],
      selection_notes: ['']
    });
  }

  ngOnInit() {
    this.loadPlatforms();
    this.loadContent();
    
    // Watch for filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadContent();
    });
  }

  async loadPlatforms() {
    try {
      const response = await this.socialContentService.getPlatforms();
      this.platforms = [
        { value: 'all', label: 'همه پلتفرم‌ها' },
        ...response.map((p: any) => ({
          value: p.platform_type,
          label: p.platform_type_display
        }))
      ];
    } catch (error) {
      console.error('Error loading platforms:', error);
    }
  }

  async loadContent() {
    this.loading = true;
    
    try {
      const filters = this.filterForm.value;
      
      // Load stories
      if (filters.content_type === 'both' || filters.content_type === 'story') {
        const storyParams = {
          page: this.currentPage,
          page_size: this.pageSize,
          platform_type: filters.platform_type,
          content_type: filters.media_type !== 'all' ? filters.media_type : undefined,
          search: filters.search || undefined,
          days_ago: filters.days_ago,
          is_processed: true
        };
        
        const storyResponse = await this.socialContentService.getStories(storyParams);
        this.stories = storyResponse.results.map((story: any) => ({
          ...story,
          type: 'story'
        }));
      } else {
        this.stories = [];
      }
      
      // Load posts
      if (filters.content_type === 'both' || filters.content_type === 'post') {
        const postParams = {
          page: this.currentPage,
          page_size: this.pageSize,
          platform_type: filters.platform_type,
          content_type: filters.media_type !== 'all' ? filters.media_type : undefined,
          search: filters.search || undefined,
          days_ago: filters.days_ago,
          is_processed: true
        };
        
        const postResponse = await this.socialContentService.getPosts(postParams);
        this.posts = postResponse.results.map((post: any) => ({
          ...post,
          type: 'post'
        }));
      } else {
        this.posts = [];
      }
      
      this.totalItems = this.stories.length + this.posts.length;
    } catch (error) {
      console.error('Error loading content:', error);
      this.notificationService.showError('خطا در بارگذاری محتوا');
    } finally {
      this.loading = false;
    }
  }

  getAllContent(): ContentItem[] {
    return [...this.stories, ...this.posts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  openSelectionModal(content: ContentItem) {
    this.currentContent = content;
    this.showSelectionModal = true;
    
    // Reset form
    this.selectionForm.patchValue({
      selected_media_type: content.extracted_images.length > 0 ? 'image' : 
                          content.extracted_videos.length > 0 ? 'video' : 'text',
      selected_media_urls: [],
      selected_text: content.extracted_text,
      use_as_product_image: false,
      use_in_description: false,
      use_as_gallery: true,
      selection_notes: ''
    });
    
    this.updateSelectedMedia();
  }

  updateSelectedMedia() {
    if (!this.currentContent) return;
    
    const mediaType = this.selectionForm.get('selected_media_type')?.value;
    let urls: string[] = [];
    
    if (mediaType === 'image') {
      urls = this.currentContent.extracted_images.map(img => img.url);
    } else if (mediaType === 'video') {
      urls = this.currentContent.extracted_videos.map(vid => vid.url);
    }
    
    this.selectionForm.patchValue({ selected_media_urls: urls });
  }

  addToSelection() {
    if (!this.currentContent || !this.selectionForm.valid) return;
    
    const formValue = this.selectionForm.value;
    
    // Validate at least one usage option is selected
    if (!formValue.use_as_product_image && !formValue.use_in_description && !formValue.use_as_gallery) {
      this.notificationService.showError('حداقل یک نوع استفاده را انتخاب کنید');
      return;
    }
    
    const selection: SelectedContent = {
      content_id: this.currentContent.id,
      content_type: this.currentContent.type,
      selected_media_type: formValue.selected_media_type,
      selected_media_urls: formValue.selected_media_urls,
      selected_text: formValue.selected_text,
      use_as_product_image: formValue.use_as_product_image,
      use_in_description: formValue.use_in_description,
      use_as_gallery: formValue.use_as_gallery,
      selection_notes: formValue.selection_notes
    };
    
    // Check if already selected
    const existingIndex = this.selectedItems.findIndex(
      item => item.content_id === selection.content_id && 
              item.selected_media_type === selection.selected_media_type
    );
    
    if (existingIndex >= 0) {
      this.selectedItems[existingIndex] = selection;
      this.notificationService.showSuccess('انتخاب به‌روزرسانی شد');
    } else {
      this.selectedItems.push(selection);
      this.notificationService.showSuccess('محتوا به انتخاب‌ها اضافه شد');
    }
    
    this.showSelectionModal = false;
  }

  removeFromSelection(index: number) {
    this.selectedItems.splice(index, 1);
    this.notificationService.showSuccess('محتوا از انتخاب‌ها حذف شد');
  }

  async confirmSelection() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('هیچ محتوایی انتخاب نشده است');
      return;
    }
    
    try {
      this.loading = true;
      
      const payload = {
        product_id: this.productId,
        selections: this.selectedItems
      };
      
      await this.socialContentService.bulkSelectContent(payload);
      
      this.notificationService.showSuccess(`${this.selectedItems.length} محتوا با موفقیت انتخاب شد`);
      this.contentSelected.emit(this.selectedItems);
      this.close();
      
    } catch (error) {
      console.error('Error confirming selection:', error);
      this.notificationService.showError('خطا در ذخیره انتخاب‌ها');
    } finally {
      this.loading = false;
    }
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.selectedItems = [];
    this.stories = [];
    this.posts = [];
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadContent();
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

  getContentTypeLabel(contentType: string): string {
    const labels: { [key: string]: string } = {
      'image': 'تصویر',
      'video': 'ویدیو',
      'text': 'متن',
      'carousel': 'کاروسل',
      'mixed': 'ترکیبی'
    };
    return labels[contentType] || contentType;
  }

  getMediaTypeIcon(mediaType: string): string {
    const icons: { [key: string]: string } = {
      'image': 'pi pi-image',
      'video': 'pi pi-video',
      'text': 'pi pi-file-text'
    };
    return icons[mediaType] || 'pi pi-file';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  async syncContent() {
    try {
      this.loading = true;
      await this.socialContentService.syncAllPlatforms();
      this.notificationService.showSuccess('همگام‌سازی محتوا آغاز شد');
      
      // Reload content after a short delay
      setTimeout(() => {
        this.loadContent();
      }, 2000);
      
    } catch (error) {
      console.error('Error syncing content:', error);
      this.notificationService.showError('خطا در همگام‌سازی محتوا');
    } finally {
      this.loading = false;
    }
  }

  trackByContentId(index: number, item: ContentItem): string {
    return item.id;
  }

  trackBySelectionId(index: number, item: SelectedContent): string {
    return `${item.content_id}-${item.selected_media_type}`;
  }
}

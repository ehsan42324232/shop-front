import { Component, OnInit } from '@angular/core';
import { Store } from '../../../models/store.model';
import { BulkImportLog } from '../../../models/bulk-import-log.model';
import { StoreService } from '../../../services/store.service';
import { ProductService } from '../../../services/product.service';
import { BulkImportService } from '../../../services/bulk-import.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.css']
})
export class ImportDataComponent implements OnInit {
  store: Store | null = null;
  importLogs: BulkImportLog[] = [];
  loading = false;
  importing = false;
  
  importForm = {
    file: null as File | null,
    updateExisting: true,
    createCategories: true
  };

  csvTemplate = [
    'title,description,price,sku,stock,category,attr_color,attr_size,attr_material,attr_brand',
    '"iPhone 15 Pro","Latest smartphone",999.99,IP15001,50,"Electronics > Smartphones","Blue","128GB","Titanium","Apple"',
    '"MacBook Pro 14","Professional laptop",1999.99,MBP14001,25,"Electronics > Laptops","Space Gray","512GB SSD","Aluminum","Apple"',
    '"Nike Air Max","Running shoes",129.99,NAM001,100,"Clothing > Shoes","White","US 10","Synthetic","Nike"'
  ];

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private bulkImportService: BulkImportService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadStore();
    this.loadImportLogs();
  }

  loadStore() {
    this.storeService.getUserStores().subscribe({
      next: (stores) => {
        this.store = stores.length > 0 ? stores[0] : null;
      },
      error: (error) => {
        console.error('Error loading store:', error);
      }
    });
  }

  loadImportLogs() {
    this.loading = true;
    this.bulkImportService.getImportLogs().subscribe({
      next: (logs) => {
        this.importLogs = logs.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading import logs:', error);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.importForm.file = file;
      } else {
        this.toastr.error('Please select a valid CSV or Excel file');
        event.target.value = '';
      }
    }
  }

  importProducts() {
    if (!this.importForm.file) {
      this.toastr.error('Please select a file to import');
      return;
    }

    if (!this.store) {
      this.toastr.error('Store not found');
      return;
    }

    this.importing = true;
    
    const formData = new FormData();
    formData.append('file', this.importForm.file);
    formData.append('store_id', this.store.id);
    formData.append('update_existing', this.importForm.updateExisting.toString());
    formData.append('create_categories', this.importForm.createCategories.toString());

    this.productService.bulkImport(formData).subscribe({
      next: (result) => {
        this.importing = false;
        this.toastr.success('Products imported successfully!');
        this.loadImportLogs();
        this.resetForm();
      },
      error: (error) => {
        this.importing = false;
        console.error('Error importing products:', error);
        this.toastr.error('Failed to import products');
      }
    });
  }

  resetForm() {
    this.importForm = {
      file: null,
      updateExisting: true,
      createCategories: true
    };
    // Reset file input
    const fileInput = document.getElementById('importFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  downloadTemplate() {
    const csvContent = this.csvTemplate.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'processing':
        return 'bg-warning';
      case 'failed':
        return 'bg-danger';
      case 'partial':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'processing':
        return 'fas fa-spinner fa-spin';
      case 'failed':
        return 'fas fa-times-circle';
      case 'partial':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-question-circle';
    }
  }

  viewImportDetails(log: BulkImportLog) {
    // This would open a modal or navigate to a details page
    console.log('View details for import:', log);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}

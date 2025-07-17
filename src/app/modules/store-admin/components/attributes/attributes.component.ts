import { Component, OnInit } from '@angular/core';
import { Store } from '../../../models/store.model';
import { ProductAttribute } from '../../../models/product-attribute.model';
import { StoreService } from '../../../services/store.service';
import { ProductAttributeService } from '../../../services/product-attribute.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  attributes: ProductAttribute[] = [];
  store: Store | null = null;
  loading = false;
  showForm = false;
  editingAttribute: ProductAttribute | null = null;

  attributeForm = {
    name: '',
    attribute_type: 'text',
    is_required: false,
    is_filterable: true,
    is_searchable: false,
    choices: [] as string[],
    unit: '',
    sort_order: 0
  };

  attributeTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'choice', label: 'Choice' },
    { value: 'color', label: 'Color' },
    { value: 'date', label: 'Date' }
  ];

  newChoice = '';

  constructor(
    private storeService: StoreService,
    private attributeService: ProductAttributeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadStore();
    this.loadAttributes();
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

  loadAttributes() {
    this.loading = true;
    this.attributeService.getAttributes().subscribe({
      next: (attributes) => {
        this.attributes = attributes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading attributes:', error);
        this.loading = false;
        this.toastr.error('Failed to load attributes');
      }
    });
  }

  openForm(attribute?: ProductAttribute) {
    this.editingAttribute = attribute || null;
    if (attribute) {
      this.attributeForm = {
        name: attribute.name,
        attribute_type: attribute.attribute_type,
        is_required: attribute.is_required,
        is_filterable: attribute.is_filterable,
        is_searchable: attribute.is_searchable,
        choices: [...attribute.choices],
        unit: attribute.unit || '',
        sort_order: attribute.sort_order
      };
    } else {
      this.resetForm();
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingAttribute = null;
    this.resetForm();
  }

  resetForm() {
    this.attributeForm = {
      name: '',
      attribute_type: 'text',
      is_required: false,
      is_filterable: true,
      is_searchable: false,
      choices: [],
      unit: '',
      sort_order: 0
    };
    this.newChoice = '';
  }

  addChoice() {
    if (this.newChoice.trim() && !this.attributeForm.choices.includes(this.newChoice.trim())) {
      this.attributeForm.choices.push(this.newChoice.trim());
      this.newChoice = '';
    }
  }

  removeChoice(index: number) {
    this.attributeForm.choices.splice(index, 1);
  }

  onAttributeTypeChange() {
    if (this.attributeForm.attribute_type !== 'choice') {
      this.attributeForm.choices = [];
    }
  }

  saveAttribute() {
    if (!this.attributeForm.name.trim()) {
      this.toastr.error('Attribute name is required');
      return;
    }

    if (this.attributeForm.attribute_type === 'choice' && this.attributeForm.choices.length === 0) {
      this.toastr.error('At least one choice is required for choice type attributes');
      return;
    }

    const attributeData = {
      ...this.attributeForm,
      store: this.store?.id
    };

    if (this.editingAttribute) {
      this.attributeService.updateAttribute(this.editingAttribute.id, attributeData).subscribe({
        next: (updatedAttribute) => {
          const index = this.attributes.findIndex(a => a.id === updatedAttribute.id);
          if (index !== -1) {
            this.attributes[index] = updatedAttribute;
          }
          this.toastr.success('Attribute updated successfully');
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating attribute:', error);
          this.toastr.error('Failed to update attribute');
        }
      });
    } else {
      this.attributeService.createAttribute(attributeData).subscribe({
        next: (newAttribute) => {
          this.attributes.push(newAttribute);
          this.toastr.success('Attribute created successfully');
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating attribute:', error);
          this.toastr.error('Failed to create attribute');
        }
      });
    }
  }

  deleteAttribute(attribute: ProductAttribute) {
    if (confirm(`Are you sure you want to delete the attribute "${attribute.name}"?`)) {
      this.attributeService.deleteAttribute(attribute.id).subscribe({
        next: () => {
          this.attributes = this.attributes.filter(a => a.id !== attribute.id);
          this.toastr.success('Attribute deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting attribute:', error);
          this.toastr.error('Failed to delete attribute');
        }
      });
    }
  }

  getAttributeTypeLabel(type: string): string {
    const typeObj = this.attributeTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }
}
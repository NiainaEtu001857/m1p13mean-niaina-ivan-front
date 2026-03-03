import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-properties',
  imports: [FormsModule , CommonModule],
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.css']
})
export class ProductPropertiesComponent {
  propertyForm = {
    name: '',
    type: '',
    selectValues: [] as string[]
  };

  properties: any[] = [];
  selectValue: string = '';

  addSelectValue() {
    if (this.selectValue) {
      this.propertyForm.selectValues.push(this.selectValue);
      this.selectValue = '';
    }
  }

  removePropertySelectValue(index: number) {
    this.propertyForm.selectValues.splice(index, 1);
  }

  addProperty() {
    if (!this.propertyForm.name || !this.propertyForm.type) return;

    this.properties.push({
      name: this.propertyForm.name,
      type: this.propertyForm.type,
      value: this.propertyForm.type !== 'Select' ? null : undefined,
      values: this.propertyForm.type === 'Select' ? [...this.propertyForm.selectValues] : []
    });

    this.propertyForm = { name: '', type: '', selectValues: [] };
  }

  removeProperty(index: number) {
    this.properties.splice(index, 1);
  }

  removePropertyValue(prop: any, index: number) {
    prop.values.splice(index, 1);
  }

  addValueToProperty(prop: any) {
    if (prop.newValue) {
      if (!prop.values) prop.values = [];
      prop.values.push(prop.newValue);
      prop.newValue = '';
    }
  }

  submitProperties() {
    console.log('Properties saved:', this.properties);
  }
}

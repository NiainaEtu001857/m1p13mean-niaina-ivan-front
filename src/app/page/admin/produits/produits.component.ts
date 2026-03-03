import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

type ServiceAttribute = {
  key?: string;
  value?: string;
};

type ShopRef = {
  _id?: string;
  name?: string;
};

type Service = {
  _id?: string;
  ref?: string;
  name?: string;
  detail?: string;
  sale_price?: number;
  min_quantity?: number;
  base_unity?: string;
  attributes?: ServiceAttribute[];
  type?: string;
  shop?: string | ShopRef;
};

@Component({
  selector: 'app-produits',
  imports: [CommonModule, RouterLink],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.css',
})
export class ProduitsComponent implements OnInit {
  services: Service[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  page = 1;
  limit = 10;
  totalPages = 0;
  totalItems = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadServices();
  }

  async loadServices() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Vous devez vous connecter.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response: any = await firstValueFrom(
        this.http.get<any>(`${environment.api}/admin/services`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
          params: {
            page: this.page,
            limit: this.limit,
          },
        })
      );

      if (Array.isArray(response)) {
        this.services = response;
        this.totalItems = this.services.length;
        this.totalPages = 1;
      } else {
        this.services = Array.isArray(response?.data) ? response.data : [];
        this.totalItems = Number(response?.totalItems) || this.services.length;
        this.totalPages = Math.max(Number(response?.totalPages) || 1, 1);
      }
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.error?.error || 'Erreur chargement services';
      this.services = [];
      this.totalPages = 0;
      this.totalItems = 0;
    } finally {
      this.isLoading = false;
    }
  }

  get filteredServices(): Service[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.services;
    }

    return this.services.filter((service) => {
      const values = [
        this.getShopName(service),
        service.ref,
        service.name,
        service.detail,
        service.type,
      ];
      return values.some((value) => String(value ?? '').toLowerCase().includes(term));
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.loadServices();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.loadServices();
    }
  }

  trackByService(index: number, service: Service): string | number {
    return service._id || service.ref || service.name || index;
  }

  getShopName(service: Service): string {
    if (!service.shop) {
      return '-';
    }

    if (typeof service.shop === 'string') {
      return service.shop;
    }

    return service.shop.name || '-';
  }

  formatAttributes(attributes?: ServiceAttribute[]): string {
    if (!Array.isArray(attributes) || attributes.length === 0) {
      return '-';
    }

    return attributes
      .filter((attr) => (attr?.key || '').trim() && (attr?.value || '').trim())
      .map((attr) => `${attr.key}: ${attr.value}`)
      .join(' | ') || '-';
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

type ServiceAttribute = {
  key?: string;
  value?: string;
};

type ServiceItem = {
  _id?: string;
  name?: string;
  ref?: string;
  type?: string;
  detail?: string;
  sale_price?: number;
  min_quantity?: number;
  base_unity?: string;
  attributes?: ServiceAttribute[];
};

@Component({
  selector: 'app-produits-liste-boutique',
  imports: [CommonModule],
  templateUrl: './produits-liste-boutique.component.html',
  styleUrl: './produits-liste-boutique.component.css',
})
export class ProduitsListeBoutiqueComponent implements OnInit {
  services: ServiceItem[] = [];
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
        this.http.get<any>(`${environment.api}/shop/service/services`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
          params: {
            page: this.page,
            limit: this.limit
          }
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

  get filteredServices(): ServiceItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.services;
    }

    return this.services.filter((service) => {
      const values = [
        service.name,
        service.ref,
        service.type,
        service.detail
      ];
      return values.some((value) => String(value ?? '').toLowerCase().includes(term));
    });
  }

  onSearch(value: string) {
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

  trackByService(index: number, service: ServiceItem): string | number {
    return service._id || service.ref || service.name || index;
  }

  formatAttributes(attributes: ServiceAttribute[] | undefined): string {
    if (!Array.isArray(attributes) || attributes.length === 0) {
      return '-';
    }

    return attributes
      .map((attr) => `${attr?.key || '-'}: ${attr?.value || '-'}`)
      .join(', ');
  }
}

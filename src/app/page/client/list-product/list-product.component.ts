import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatNumber } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CartComponent } from "../cart/cart.component";
import { CartService } from '../../../services/cart.service';
import { OrderDetail } from '../../../interface/order.interface';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [FormsModule, CommonModule, CartComponent],
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListProductComponent implements OnInit {

  shop: any = null;
  currentShopId: string | null = null;
  services: any[] = [];
  page: number = 1;
  limit: number = 5;
  totalPages: number = 0;
  private readonly fallbackServiceImage = 'assets/img/logo.svg';

  selectedService: any = null;
  quantityToAdd: number = 1;
  showQuantityModal: boolean = false;

  orderDetail!: OrderDetail;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private cartService: CartService  
  ) {}

  async ngOnInit(): Promise<void> {
    const shopId = this.route.snapshot.paramMap.get('id');
    this.currentShopId = shopId;
    await this.loadServices(shopId);
  }

  async loadServices(id?: any) {
    if (!id) {
      this.services = [];
      this.shop = null;
      this.totalPages = 0;
      this.cdr.markForCheck();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token || ''}`,
      });
      const response: any = await firstValueFrom(
        this.http.get(`${environment.api}/client/shop/${id}/services`, {
          headers,
          params: { page: this.page, limit: this.limit },
        })
      );

      this.services = this.extractServices(response);
      this.shop = response?.shop ? { ...response.shop } : null;
      this.totalPages = Math.max(Number(response?.totalPages) || 1, 1);
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      }

      this.cdr.markForCheck();
    } catch (error) {
      this.services = [];
      this.shop = null;
      this.totalPages = 0;
      this.cdr.markForCheck();
      console.error('Erreur lors du chargement des services', error);
    }
  }

  private extractServices(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.services)) return response.services;
    if (Array.isArray(response?.data)) return response.data;
    if (response?.service && typeof response.service === 'object') return [response.service];
    return [];
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadServices(this.currentShopId);
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadServices(this.currentShopId);
    }
  }
  addToCart() {
    if (!this.shop){
      console.error('Aucun shop sélectionné pour ajouter le service au panier');
      return;
    }
   this.orderDetail = {
    quantity: this.quantityToAdd,
    serviceName :this.selectedService.name,
    unitPrice: this.selectedService.sale_price,
    totalPrice: this.selectedService.sale_price * this.quantityToAdd,
    service: this.selectedService._id
   };
   let idShop = this.shop._id.toString();
   console.log(idShop);
   
    this.cartService.addToCartShop(idShop , this.orderDetail);
    this.showQuantityModal = false;
  }

  resolveServicePhoto(photo: string | null | undefined): string {
    if (!photo) {
      return this.fallbackServiceImage;
    }

    const normalized = String(photo).trim();
    if (!normalized) {
      return this.fallbackServiceImage;
    }

    if (/^https?:\/\//i.test(normalized)) {
      return normalized;
    }

    if (normalized.startsWith('/public/')) {
      return `${environment.api}${normalized}`;
    }

    return `${environment.api}/public/${normalized.replace(/^\/+/, '')}`;
  }

  onServicePhotoError(event: Event): void {
    const element = event.target as HTMLImageElement | null;
    if (!element) {
      return;
    }
    element.src = this.fallbackServiceImage;
  }
  openQuantityModal(service: any) {
    this.selectedService = service;
    this.quantityToAdd = service.min_quantity;
    this.showQuantityModal = true;
  }
  closeQuantityModal() {
    this.showQuantityModal = false;
  }
}

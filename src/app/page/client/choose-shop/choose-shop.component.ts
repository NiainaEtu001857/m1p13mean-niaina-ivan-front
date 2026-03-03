import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartComponent } from "../cart/cart.component";

@Component({
  selector: 'app-choose-shop',
  standalone: true,
  imports: [FormsModule, CommonModule, CartComponent],
  templateUrl: './choose-shop.component.html',
  styleUrls: ['./choose-shop.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Injectable({ providedIn: 'root' })
export class ChooseShopComponent implements OnInit {
  shops: any[] = [];
  page: number = 1;
  limit: number = 12;
  totalPages: number = 0;
  private readonly fallbackShopImage = 'assets/img/logo.svg';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    console.log(localStorage.getItem('token'));
    
    await this.loadShops();
  }

  async loadShops(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token || ''}`,
      });

      const response: any = await firstValueFrom(
        this.http.get(`${environment.api}/client/shops`, {
          headers,
          params: { page: this.page, limit: this.limit },
        })
      );
      console.log(response.data);
      

      this.shops = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      this.totalPages = Math.max(Number(response?.totalPages) || 1, 1);
      const maxPage = this.totalPages;
      if (this.page > maxPage) {
        this.page = maxPage;
      }
      this.cdr.markForCheck();
    } catch (error) {
      this.shops = [];
      this.totalPages = 0;
      this.cdr.markForCheck();
      console.error('Erreur lors du chargement des shops', error);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadShops();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadShops();
    }
  }

  viewShop(shopId: any): void {
    this.router.navigate(['/client/shop', shopId]);
  }

  resolveShopPhoto(photo: string | null | undefined): string {
    if (!photo) {
      return this.fallbackShopImage;
    }

    const normalized = String(photo).trim();
    if (!normalized) {
      return this.fallbackShopImage;
    }

    if (/^https?:\/\//i.test(normalized)) {
      return normalized;
    }

    if (normalized.startsWith('/public/')) {
      return `${environment.api}${normalized}`;
    }

    return `${environment.api}/public/${normalized.replace(/^\/+/, '')}`;
  }

  onShopPhotoError(event: Event): void {
    const element = event.target as HTMLImageElement | null;
    if (!element) {
      return;
    }
    element.src = this.fallbackShopImage;
  }
}

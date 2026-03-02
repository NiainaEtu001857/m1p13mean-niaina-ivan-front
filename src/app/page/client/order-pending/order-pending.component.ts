import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-pending',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './order-pending.component.html',
  styleUrl: './order-pending.component.css',
})
export class OrderPendingComponent implements OnInit {
  selectedStatus: 'pending' | '' = 'pending';
  orders: any[] = [];
  selectedOrder: any = null;
  showModal: boolean = false;
  shopDetail = {
    name: '',
    type: ''
  };
  constructor(
    private orderService: OrderService , 
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadOrders(this.selectedStatus);
  }

  async loadOrders(status: 'pending' | '') {
    this.selectedStatus = status;
    
    if (status === 'pending') {
      this.orders = await firstValueFrom(this.orderService.getClientOrdersPending());
    } else if (status === '') {
      this.orders = await firstValueFrom(this.orderService.getClientOrderHistory());
    }
    this.cdr.markForCheck();
  }

  async openDetail(order: any) {
    this.selectedOrder = order;
    
    this.showModal = true;
  }
  async getShop(id: any) {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${environment.api}/shop/${id}`, {
          params: { id: id },
        })
      );
      this.shopDetail = response.data;
    } catch (error) {
      this.cdr.markForCheck();
    }
  }

  closeModal() {
    this.selectedOrder = null;
    this.showModal = false;
    this.shopDetail = {
      name: '',
      type: ''
    };
  }

}

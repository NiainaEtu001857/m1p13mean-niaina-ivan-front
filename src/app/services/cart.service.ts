import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { OrderDetail, ShopOrder } from '../interface/order.interface';
import { Shop } from '../interface/shops.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private shopsDetail: ShopOrder[] = [];
  private info!: ShopOrder;
  private items: any[] = [];
  private itemsSubject = new BehaviorSubject<any[]>([]);

  cart$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // addToCart(item: any) {
  //   const existing = this.items.find(i => i._id === item._id);
  //   if (existing) {
  //     existing.quantity += 1;
  //   } else {
  //     this.items.push({ ...item, quantity: 1 });
  //   }
  //   this.itemsSubject.next(this.items);
  // }

  async createOrder(order: { shops: any[]; totalAmount: number }): Promise<any> {
    try {

      const token = localStorage.getItem('token');
      console.log(localStorage.getItem('token'));
      
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token ?? ''}`
      });

      const response = await firstValueFrom(
        this.http.post(`${environment.api}/orders/confirm`, { shops: order.shops, totalAmount: order.totalAmount }, { headers })
      );

      console.log('Order created successfully:', response);
      return response;

    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  addToCartShop(shop: string , detailCart: OrderDetail){
    const existShop = this.shopsDetail.find(i => i.shop === shop);
    if (existShop) {
      let existItem = existShop.items.find((i: any) => i.service === detailCart.service);
      if (existItem) {
        existItem.quantity += detailCart.quantity;
        existItem.totalPrice += detailCart.totalPrice;
      } else {
        existShop.items.push(detailCart);
      }
    }else {
      let itemsImage = [];
      itemsImage.push(detailCart);
      this.info = {
        shop: shop,
        items:itemsImage
      };
      this.shopsDetail.push(this.info);
    }
    console.log(this.shopsDetail);
    this.itemsSubject.next(this.shopsDetail);
    
  }

  remove(shop: string, item: any) {
    const shopIndex = this.shopsDetail.findIndex(i => i.shop === shop);
    console.log("shopIndex" , shopIndex);
    if (shopIndex !== -1) {
      const itemIndex = this.shopsDetail[shopIndex].items.findIndex((i: any) => i.service === item.service);
      if (itemIndex !== -1) {
        this.shopsDetail[shopIndex].items.splice(itemIndex, 1);
        if (this.shopsDetail[shopIndex].items.length === 0) {
          this.shopsDetail.splice(shopIndex, 1);
        }
        this.itemsSubject.next(this.shopsDetail);
      }
    }
    console.log(this.shopsDetail);
    
  }

  async VerifyStockAndServiceAvailability(item: any): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token ?? ''}`
      });
      const response = await firstValueFrom(
        this.http.post(`${environment.api}/orders/verify-stock`, { item }, { headers })
      );
      console.log('Stock verification response:', response);
      return response;
    } catch (error) {
      console.error('Error verifying stock:', error);
      throw error;
    }
  }

  clear() {
    this.shopsDetail = [];
    this.itemsSubject.next(this.shopsDetail);
  }

  getItems() {
    return  this.shopsDetail.reduce((sum, shop) => sum + shop.items.length, 0);
  }


  getTotale() {
    return this.shopsDetail.reduce((sum, i) => sum + i.items.reduce((sum , j) => sum + j.totalPrice , 0), 0);
  }

  
}
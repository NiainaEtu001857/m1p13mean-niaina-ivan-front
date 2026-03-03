import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private API = `${environment.api}`;
  user = {
    id:'',
    email:''
  };

  constructor(private http: HttpClient) {}

  createOrder(order: any, shopId: string): Observable<any> {
    return this.http.post(`${this.API}/orders`, { ...order, shopId });
  }

  getClients(): Observable<any> {
    return this.http.get(`${this.API}/client/clients`);
  }

  getServicesByShop(shopId: string): Observable<any> {
    return this.http.get(`${this.API}/shop/service/services/${shopId}`);
  }

  getShopOrders(shopId: string, page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page);
    }
    if (limit !== undefined) {
      params = params.set('limit', limit);
    }
    return this.http.get<any>(`${this.API}/orders/shop/${shopId}`, { params });
  }

  getClientOrdersPending(page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page);
    if (limit !== undefined) params = params.set('limit', limit);

    const user = localStorage.getItem("id");
    console.log("user",user);
    
    
    if (user) params = params.set('clientId', user);

    params = params.set('status', 'pending');

    return this.http.get<any>(`${this.API}/orders/client`, { params });
  }

  getClientOrderHistory(page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page !== undefined) params = params.set('page', page);
    if (limit !== undefined) params = params.set('limit', limit);

    const id = localStorage.getItem("id");
    if (id) params = params.set('clientId', id);

    return this.http.get<any>(`${this.API}/orders/client`, { params });
  }
  
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule , FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class CartComponent implements OnInit {
  cartItems: any[] = [];
  showCart = false;
  cartTotal = 0;

  constructor(private cartService: CartService , private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getItems();
      this.cdr.markForCheck();
    });

    console.log("cartItems" ,this.cartItems);
  }


  toggleCart() {
    this.showCart = !this.showCart;
  }

  remove(shop: any, item: any) {
    this.cartService.remove(shop, item);
  }

  clear() {
    this.cartService.clear();
  }

  get total() {
    return this.cartService.getTotale();
  }

  async Buy() {
    try {
      let order = {
        shops: this.cartItems,
        totalAmount: this.cartService.getTotale()
      } 
      await this.cartService.createOrder(order);
      this.cartService.clear();
    } catch (error) {
      console.error(error);
    }
  }

}
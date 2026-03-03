import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
}

interface Order {
  id: string;
  customer: Customer;
  date: Date;
  items: OrderItem[];
  total: number;
  status: string;
}

@Component({
  selector: 'app-commandes-boutique',
  standalone: true, 
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './commandes-boutique.component.html',
  styleUrls: ['./commandes-boutique.component.css'], 
})
export class CommandesBoutiqueComponent implements OnInit {
  
  searchText: string = '';
  statusFilter: string = '';
  selectedOrder: Order | null = null;

  orders: Order[] = [];
  allOrders: Order[] = [];
  pagedOrders: Order[] = [];
  page = 1;
  limit = 10;
  totalPages = 0;

  constructor() {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.allOrders = [
      {
        id: 'CMD-1001',
        customer: { name: 'Jean Dupont', email: 'jean@gmail.com' },
        date: new Date(),
        items: [
          { name: 'Télévision Samsung', quantity: 1 },
          { name: 'Support mural', quantity: 1 }
        ],
        total: 599.99,
        status: 'En attente'
      },
      {
        id: 'CMD-1002',
        customer: { name: 'Marie Claire', email: 'marie@gmail.com' },
        date: new Date(),
        items: [
          { name: 'Chaussures Nike', quantity: 2 },
          { name: 'T-shirt', quantity: 1 },
          { name: 'Casquette', quantity: 1 }
        ],
        total: 120.50,
        status: 'Confirmée'
      },
      {
        id: 'CMD-1003',
        customer: { name: 'Paul Martin', email: 'paul@gmail.com' },
        date: new Date(),
        items: [
          { name: 'Casque Bluetooth', quantity: 1 }
        ],
        total: 89.99,
        status: 'Expédiée'
      }
    ];

    this.applyFilters();
  }

  applyFilters(): void {
    this.orders = this.allOrders.filter(order => {
      const matchSearch =
        !this.searchText ||
        order.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        order.items.some(item =>
          item.name.toLowerCase().includes(this.searchText.toLowerCase())
        );

      const matchStatus =
        !this.statusFilter || order.status === this.statusFilter;

      return matchSearch && matchStatus;
    });

    this.page = 1;
    this.updatePagination();
  }

  clearFilters(): void {
    this.searchText = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  refresh(): void {
    this.loadOrders();
  }

  viewOrder(order: Order): void {
    this.selectedOrder = order;
  }

  editOrder(order: Order): void {
    console.log('Modifier commande :', order);
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  updatePagination(): void {
    this.totalPages = this.orders.length > 0 ? Math.ceil(this.orders.length / this.limit) : 0;
    if (this.totalPages > 0 && this.page > this.totalPages) {
      this.page = this.totalPages;
    }
    if (this.totalPages === 0) {
      this.page = 1;
      this.pagedOrders = [];
      return;
    }
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    this.pagedOrders = this.orders.slice(start, end);
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.updatePagination();
    }
  }

}

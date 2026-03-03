import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderService } from '../../../../services/order';

@Component({ selector: 'app-commandes-ajout', imports: [CommonModule, FormsModule],
  templateUrl: './commandes-ajout.component.html',
  styleUrls: ['./commandes-ajout.component.css']
})
export class CommandesAjoutComponent implements OnInit {
  order: any = {
    items: [],
    total: 0,
    status: 'pending',
    clientId: '',
  };

  newItem: any = { serviceId: '', quantity: 1 };

  clients: any[] = [];
  services: any[] = [];

  shopId: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.shopId = user?.id || user?._id || '';
      } catch {
        this.shopId = storedUser;
      }
    }

    this.orderService.getClients().subscribe(clients => this.clients = clients);
    if (this.shopId) {
      this.orderService.getServicesByShop(this.shopId).subscribe(services => this.services = services);
    }
  }

  addItem(): void {
    if (!this.newItem.serviceId || this.newItem.quantity <= 0) return;
    const service = this.services.find((s: any) => s._id === this.newItem.serviceId);
    if (!service) return;
    const unitPrice = Number(service.sale_price || 0);
    this.order.items.push({
      serviceId: this.newItem.serviceId,
      serviceName: service.name,
      quantity: this.newItem.quantity,
      unitPrice,
      totalPrice: this.newItem.quantity * unitPrice
    });

    this.calculateTotal();
    this.newItem = { serviceId: '', quantity: 1 };
  }

  get selectedServicePrice(): number {
    if (!this.newItem.serviceId) return 0;
    const service = this.services.find((s: any) => s._id === this.newItem.serviceId);
    return Number(service?.sale_price || 0);
  }

  removeItem(index: number): void {
    this.order.items.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.order.total = this.order.items.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
  }

  submit(form: NgForm): void {
    if (form.invalid || this.order.items.length === 0 || !this.order.clientId) {
      alert('Veuillez remplir tous les champs et ajouter au moins un article.');
      return;
    }

    this.orderService.createOrder(this.order, this.shopId).subscribe({
      next: res => {
        alert('Commande ajoutée avec succès !');
        this.order = { items: [], total: 0, status: 'pending', clientId: '' };
        form.resetForm();
      },
      error: err => {
        console.error(err);
        alert('Erreur lors de la création de la commande.');
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../../../services/order';

interface Client {
  _id: string;
  first_name: string;
  email: string;
}

interface OrderItem {
  service?: string;
  serviceId?: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  ref?: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  client: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-commandes-historique',
  standalone: true,
  imports: [CommonModule , FormsModule ],
  templateUrl: './commandes-historique.component.html',
  styleUrl: './commandes-historique.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandesHistoriqueComponent implements OnInit {
  searchText: string = '';
  statusFilter: string = '';
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  showModal = false;
  showEditModal = false;
  clientsById: Record<string, Client> = {};
  shopId: string = '';
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  saveMessage = '';
  saveErrorMessage = '';
  page = 1;
  limit = 10;
  totalPages = 0;
  totalItems = 0;
  editableOrder: Order | null = null;

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {}

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

    if (this.shopId) {
      this.loadData();
    } else {
      this.errorMessage = 'Boutique introuvable.';
      this.cdr.markForCheck();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      orders: this.orderService.getShopOrders(this.shopId, this.page, this.limit),
      clients: this.orderService.getClients()
    }).subscribe({
      next: ({ orders, clients }) => {
        const clientsList = Array.isArray(clients?.data) ? clients.data : clients || [];
        this.clientsById = clientsList.reduce((acc: Record<string, Client>, client: Client) => {
          acc[client._id] = client;
          return acc;
        }, {});
        if (Array.isArray(orders?.data)) {
          this.orders = orders.data.map((order: Order) => this.normalizeOrder(order));
          this.totalItems = Number(orders?.totalItems) || this.orders.length;
          this.totalPages = Math.max(Number(orders?.totalPages) || 1, 1);
        } else {
          this.orders = (Array.isArray(orders) ? orders : []).map((order: Order) => this.normalizeOrder(order));
          this.totalItems = this.orders.length;
          this.totalPages = 1;
        }
        this.applyFilters();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement de l\'historique.';
        this.totalItems = 0;
        this.totalPages = 0;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    const search = this.searchText.trim().toLowerCase();
    this.filteredOrders = this.orders.filter((order) => {
      const client = this.clientsById[order.client];
      const idMatch = ((order.ref || order._id) || '').toLowerCase().includes(search);
      const nameMatch = (client?.first_name || '').toLowerCase().includes(search);
      const emailMatch = (client?.email || '').toLowerCase().includes(search);
      const serviceMatch = (order.items || []).some((item) =>
        (item.serviceName || '').toLowerCase().includes(search)
      );
      const matchesSearch = !search || idMatch || nameMatch || emailMatch || serviceMatch;
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  deleteOrder(orderId: string) {
    if (confirm('Voulez-vous supprimer cette commande ?')) {
      this.orders = this.orders.filter((order) => order._id !== orderId);
      if (this.selectedOrder?._id === orderId) {
        this.closeModal();
      }
      this.applyFilters();
    }
  }

  viewOrder(order: Order): void {
    this.openDetail(order);
  }

  editOrder(order: Order): void {
    this.saveErrorMessage = '';
    this.saveMessage = '';
    this.editableOrder = {
      ...order,
      items: (order.items || []).map((item) => ({ ...item }))
    };
    this.showEditModal = true;
  }

  closeOrderDetails(): void {
    this.closeModal();
  }

  openDetail(order: Order): void {
    this.selectedOrder = order;
    this.showModal = true;
  }

  closeModal(): void {
    this.selectedOrder = null;
    this.showModal = false;
  }

  closeEditModal(): void {
    this.editableOrder = null;
    this.showEditModal = false;
    this.isSaving = false;
    this.saveErrorMessage = '';
  }

  updateItemTotal(item: OrderItem): void {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    item.quantity = Math.max(Math.trunc(qty), 0);
    item.totalPrice = item.quantity * price;
    this.updateEditableTotal();
  }

  updateEditableTotal(): void {
    if (!this.editableOrder) return;
    this.editableOrder.totalAmount = (this.editableOrder.items || []).reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0
    );
  }

  saveOrderChanges(): void {
    if (!this.editableOrder || !this.shopId || this.isSaving) return;

    const hasItems = (this.editableOrder.items || []).some((item) => Number(item.quantity) > 0);
    if (!hasItems) {
      this.saveErrorMessage = 'La commande doit contenir au moins un article avec une quantité > 0.';
      return;
    }

    this.isSaving = true;
    this.saveErrorMessage = '';
    this.saveMessage = '';
    const extractServiceId = (value: unknown): string => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null && '_id' in (value as Record<string, unknown>)) {
        return String((value as Record<string, unknown>)['_id'] || '');
      }
      return '';
    };

    const payload = {
      status: this.editableOrder.status,
      items: (this.editableOrder.items || []).map((item) => ({
        service: extractServiceId(item.serviceId) || extractServiceId(item.service),
        serviceId: extractServiceId(item.serviceId) || extractServiceId(item.service),
        quantity: Number(item.quantity) || 0
      }))
    };

    this.orderService
      .updateShopOrder(this.editableOrder._id, this.shopId, payload)
      .subscribe({
        next: (updatedOrder) => {
          this.orders = this.orders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          );

          if (this.selectedOrder?._id === updatedOrder._id) {
            this.selectedOrder = updatedOrder;
          }

          this.applyFilters();
          this.saveMessage = 'Commande modifiée avec succès.';
          this.isSaving = false;
          this.closeEditModal();
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Erreur update commande:', error);
          this.saveErrorMessage =
            error?.error?.message ||
            error?.error?.error ||
            'Erreur lors de la modification de la commande.';
          this.cdr.markForCheck();
        }
      });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.loadData();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.loadData();
    }
  }

  getStatusLabel(status: string): string {
    if (status === 'pending') return 'En attente';
    if (status === 'confirmed') return 'Confirmée';
    if (status === 'delivered') return 'Livrée';
    if (status === 'cancelled') return 'Annulée';
    return status;
  }

  private normalizeOrder(order: Order): Order {
    return {
      ...order,
      items: (order.items || []).map((item) => this.normalizeItem(item))
    };
  }

  private normalizeItem(item: OrderItem): OrderItem {
    const serviceValue = this.toId(item.service) || this.toId(item.serviceId);

    return {
      ...item,
      service: serviceValue,
      serviceId: serviceValue,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: Number(item.totalPrice) || 0
    };
  }

  private toId(value: unknown): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null && '_id' in (value as Record<string, unknown>)) {
      return String((value as Record<string, unknown>)['_id'] || '');
    }
    return '';
  }
}

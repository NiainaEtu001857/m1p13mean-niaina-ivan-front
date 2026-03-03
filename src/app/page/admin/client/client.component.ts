import { Component, OnInit } from '@angular/core';
import { ClientCardComponent } from './client-card/client-card.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

type Client = {
  id?: number | string;
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

@Component({
  selector: 'app-client',
  imports: [CommonModule, ClientCardComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  page = 1;
  limit = 10;
  totalPages = 0;
  totalItems = 0;
  deletingClientId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients();
  }

  async loadClients() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Vous devez vous connecter.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response: any = await firstValueFrom(
        this.http.get<any>(`${environment.api}/admin/clients`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
          params: {
            page: this.page,
            limit: this.limit,
          },
        })
      );

      if (Array.isArray(response)) {
        this.clients = response;
        this.totalItems = this.clients.length;
        this.totalPages = 1;
      } else {
        this.clients = Array.isArray(response?.data) ? response.data : [];
        this.totalItems = Number(response?.totalItems) || this.clients.length;
        this.totalPages = Math.max(Number(response?.totalPages) || 1, 1);
      }
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.error?.error || 'Erreur chargement clients';
      this.clients = [];
      this.totalPages = 0;
      this.totalItems = 0;
    } finally {
      this.isLoading = false;
    }
  }

  get filteredClients(): Client[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.clients;
    }

    return this.clients.filter((client) => {
      const values = [client.id, client.first_name, client.last_name, client.email];
      return values.some((value) => String(value ?? '').toLowerCase().includes(term));
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page -= 1;
      this.loadClients();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.loadClients();
    }
  }

  trackByClient(index: number, client: Client): string | number {
    return client._id || client.id || client.email || index;
  }

  async deleteClient(client: Client): Promise<void> {
    const clientId = client._id || (typeof client.id === 'string' ? client.id : '');
    if (!clientId) {
      this.errorMessage = 'ID client manquant.';
      return;
    }

    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.email || 'ce client';
    const confirmed = window.confirm(`Supprimer ${fullName} ?`);
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Vous devez vous connecter.';
      return;
    }

    this.deletingClientId = clientId;
    this.errorMessage = '';

    try {
      await firstValueFrom(
        this.http.delete(`${environment.api}/admin/clients/${clientId}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        })
      );

      if (this.clients.length === 1 && this.page > 1) {
        this.page -= 1;
      }

      await this.loadClients();
    } catch (error: any) {
      this.errorMessage = error?.error?.message || error?.error?.error || 'Erreur suppression client';
    } finally {
      this.deletingClientId = null;
    }
  }
}

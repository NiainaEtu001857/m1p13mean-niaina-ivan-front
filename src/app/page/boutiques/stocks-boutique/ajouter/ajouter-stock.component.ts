import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ajouter-stock',
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-stock.component.html',
  styleUrl: './ajouter-stock.component.css',
})
export class AjouterStockComponent implements OnInit {
  services: any[] = [];
  isLoadingServices = false;

  stockForm = {
    service: '',
    quantity: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadServices();
  }

  async loadServices() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez vous connecter.');
      return;
    }

    this.isLoadingServices = true;
    try {
      this.services = await firstValueFrom(
        this.http.get<any[]>(`${environment.api}/shop/service/services`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        })
      );
    } catch (error: any) {
      alert(error?.error?.message || error?.error?.error || 'Erreur chargement services');
    } finally {
      this.isLoadingServices = false;
    }
  }

  async submit(event: Event) {
    event.preventDefault();

    if (!this.stockForm.service) {
      alert('Sélectionnez un produit/service.');
      return;
    }

    if (Number(this.stockForm.quantity) < 0) {
      alert('La quantité du stock doit être positive.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez vous connecter.');
      return;
    }

    try {
      await firstValueFrom(
        this.http.post(
          `${environment.api}/shop/stock/add`,
          {
            service: this.stockForm.service,
            quantity: Number(this.stockForm.quantity)
          },
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }),
          }
        )
      );

      alert('Stock ajouté avec succès.');
      this.stockForm = {
        service: '',
        quantity: 0
      };
    } catch (error: any) {
      alert(error?.error?.message || error?.error?.error || 'Erreur serveur');
    }
  }
}

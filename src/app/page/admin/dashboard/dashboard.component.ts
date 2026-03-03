import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TauxRevenuComponent } from "./taux-revenu/taux-revenu.component";
import { CommonModule } from '@angular/common';
import { TauxRevenuMensuelComponent } from "./taux-revenu-mensuel/taux-revenu-mensuel.component";
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

type TopSellingProduct = {
  product: string;
  price: number;
  quantitySold: number;
  shop: string;
  clientCount: number;
}

type Stats = {
  nbrClient?: number;
  nbrService?: number;
  nbrShop?: number;
  topSellingProducts?: TopSellingProduct[];
  chartLabels?: string[];
  monthlyRevenue?: number[];
  monthlyNewClients?: number[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TauxRevenuComponent, TauxRevenuMensuelComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent {
  stats: Stats = {};
  isLoading = false;
  errorMessage = '';
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  async loadStats() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Vous devez vous connecter.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response: Stats = await firstValueFrom(
        this.http.get<Stats>(`${environment.api}/admin/stats`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        })
      )
      console.log('Stats response:', response);
      this.stats = response;
      this.isLoading = false;
    } catch (error: any){
      this.errorMessage = error?.error?.message || error?.error?.error || 'Erreur chargement ';
      this.stats = {};
      this.isLoading = false;
    }
  }
  





}

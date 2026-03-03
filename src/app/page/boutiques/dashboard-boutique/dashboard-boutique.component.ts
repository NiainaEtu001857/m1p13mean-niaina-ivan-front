import { ChangeDetectorRef, Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { first, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


@Component({
  selector: 'app-dashboard-boutique',
  imports: [
    BaseChartDirective,
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard-boutique.component.html',
  styleUrl: './dashboard-boutique.component.css',
})
export class DashboardBoutiqueComponent {

  constructor( 
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    
    ) { }
    

   lineChartLabels: any[] = [
     
    ];

    lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      {
        data: [],
        label: 'Revenu Mensuel (€)',
        fill: false,
        borderColor: '#42A5F5',
        backgroundColor: '#42A5F5',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  public lineChartType: 'line' = 'line';


  dashboardData: any;


  ngOnInit(): void {
    this.loadDashboardData();
  }


  async loadDashboardData() {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token || ''}`,
      });
      this.dashboardData = await firstValueFrom(
        this.http.get(`${environment.api}/shop/dashboard`, {
          headers,
        })
      );
     this.lineChartLabels = [];
    const dataArray: number[] = [];

    this.dashboardData.statisticsRevenue.forEach((s: any) => {
      this.lineChartLabels.push(s._id);
      dataArray.push(s.total);
    });

    this.lineChartData = {
      labels: this.lineChartLabels,
      datasets: [
        {
          data: dataArray,
          label: 'Revenu',
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    };
    this.cdr.markForCheck();


      console.log('Dashboard data:', this.dashboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.dashboardData = null;
    }
  }
}

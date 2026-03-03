import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


@Component({
  selector: 'app-dashboard-boutique',
  imports: [BaseChartDirective],
  templateUrl: './dashboard-boutique.component.html',
  styleUrl: './dashboard-boutique.component.css',
})
export class DashboardBoutiqueComponent {
  public lineChartLabels: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    public lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      {
        data: [1200, 1500, 1000, 1800, 1700, 2000, 2100, 1900, 2200, 2300, 2500, 2700],
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
}

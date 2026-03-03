import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

@Component({
  selector: 'app-taux-revenu-mensuel',
  imports: [BaseChartDirective],
  templateUrl: './taux-revenu-mensuel.component.html',
  styleUrl: './taux-revenu-mensuel.component.css',
})
export class TauxRevenuMensuelComponent {
  private defaultLabels: string[] = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  private defaultNewClients: number[] = [8, 12, 10, 15, 14, 18, 16, 20, 22, 19, 24, 26];

  public lineChartLabels: string[] = this.defaultLabels;

  public lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      {
        data: this.defaultNewClients,
        label: 'Nouveaux clients',
        fill: false,
        borderColor: '#42A5F5',
        backgroundColor: '#42A5F5',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  @Input() set chartLabels(value: string[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.lineChartData.labels = value;
    } else {
      this.lineChartData.labels = this.defaultLabels;
    }
  }

  @Input() set monthlyNewClients(value: number[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.lineChartData.datasets[0].data = value;
    } else {
      this.lineChartData.datasets[0].data = this.defaultNewClients;
    }
  }

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

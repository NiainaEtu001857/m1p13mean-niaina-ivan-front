import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-taux-revenu',
  imports: [BaseChartDirective],
  templateUrl: './taux-revenu.component.html',
  styleUrl: './taux-revenu.component.css',
})
export class TauxRevenuComponent {
  private defaultLabels: string[] = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  private defaultRevenue: number[] = [1200, 1500, 1000, 1800, 1700, 2000, 2100, 1900, 2200, 2300, 2500, 2700];

  public barChartType: 'bar' = 'bar';
  private barColor = 'rgba(54, 162, 235, 0.8)';

  public barChartData: ChartData<'bar'> = {
    labels: this.defaultLabels,
    datasets: [
      {
        data: this.defaultRevenue,
        label: "Chiffre d'affaires mensuel (Ariary)",
        backgroundColor: this.barColor,
        borderRadius: 10,
        barPercentage: 0.6,
      }
    ]
  };

  @Input() set chartLabels(value: string[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.barChartData.labels = value;
    } else {
      this.barChartData.labels = this.defaultLabels;
    }
  }

  @Input() set monthlyRevenue(value: number[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.barChartData.datasets[0].data = value;
    } else {
      this.barChartData.datasets[0].data = this.defaultRevenue;
    }
  }

  public barChartOptions: ChartOptions<'bar'> = {
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
}

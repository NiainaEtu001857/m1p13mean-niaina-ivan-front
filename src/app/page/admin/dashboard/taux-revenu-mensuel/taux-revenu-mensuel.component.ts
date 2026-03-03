import { Component, Input, ViewChild } from '@angular/core';
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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private defaultLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private defaultNewClients: number[] = [8, 12, 10, 15, 14, 18, 16, 20, 22, 19, 24, 26];
  private currentLabels: string[] = this.defaultLabels;
  private currentNewClients: number[] = this.defaultNewClients;

  public lineChartData: ChartData<'line'> = this.buildChartData();

  @Input() set chartLabels(value: string[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.currentLabels = value;
    } else {
      this.currentLabels = this.defaultLabels;
    }
    this.refreshChartData();
  }

  @Input() set monthlyNewClients(value: number[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.currentNewClients = value;
    } else {
      this.currentNewClients = this.defaultNewClients;
    }
    this.refreshChartData();
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

  private buildChartData(): ChartData<'line'> {
    return {
      labels: this.currentLabels,
      datasets: [
        {
          data: this.currentNewClients,
          label: 'New Clients',
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    };
  }

  private refreshChartData(): void {
    this.lineChartData = this.buildChartData();
    this.chart?.update();
  }
}

import { Component, Input, ViewChild } from '@angular/core';
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
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private defaultLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private defaultRevenue: number[] = [1200, 1500, 1000, 1800, 1700, 2000, 2100, 1900, 2200, 2300, 2500, 2700];
  private currentLabels: string[] = this.defaultLabels;
  private currentRevenue: number[] = this.defaultRevenue;

  public barChartType: 'bar' = 'bar';
  private barColor = 'rgba(54, 162, 235, 0.8)';

  public barChartData: ChartData<'bar'> = this.buildChartData();

  @Input() set chartLabels(value: string[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.currentLabels = value;
    } else {
      this.currentLabels = this.defaultLabels;
    }
    this.refreshChartData();
  }

  @Input() set monthlyRevenue(value: number[] | undefined) {
    if (Array.isArray(value) && value.length > 0) {
      this.currentRevenue = value;
    } else {
      this.currentRevenue = this.defaultRevenue;
    }
    this.refreshChartData();
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

  private buildChartData(): ChartData<'bar'> {
    return {
      labels: this.currentLabels,
      datasets: [
        {
          data: this.currentRevenue,
          label: 'Monthly Revenue (EUR)',
          backgroundColor: this.barColor,
          borderRadius: 10,
          barPercentage: 0.6,
        }
      ]
    };
  }

  private refreshChartData(): void {
    this.barChartData = this.buildChartData();
    this.chart?.update();
  }
}

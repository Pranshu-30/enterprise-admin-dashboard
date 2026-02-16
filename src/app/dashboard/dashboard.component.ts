import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, map, delay } from 'rxjs';
import { KpiCardComponent } from '../shared/components/kpi-card/kpi-card.component';
import { FormatCurrencyPipe } from '../shared/pipes/format-currency.pipe';
import { ChartModule, CategoryService, ColumnSeriesService } from '@syncfusion/ej2-angular-charts';

export interface ActivityItem {
  id: number;
  action: string;
  user: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, KpiCardComponent, FormatCurrencyPipe, ChartModule],
  providers: [CategoryService, ColumnSeriesService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  totalUsers = 1248;
  totalRevenue = 89420;
  totalOrders = 356;
  trendUsers = 12;
  trendRevenue = 8;
  trendOrders = -2;

  primaryXAxis: object = { valueType: 'Category', title: 'Month' };
  primaryYAxis: object = { title: 'Revenue ($)', labelFormat: 'c0' };
  chartTitle = 'Monthly Revenue';
  chartData: object[] = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 14500 },
    { month: 'Mar', revenue: 13200 },
    { month: 'Apr', revenue: 16800 },
    { month: 'May', revenue: 19200 },
    { month: 'Jun', revenue: 22100 },
  ];

  recentActivity$: Observable<ActivityItem[]> = of([
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 min ago' },
    { id: 2, action: 'Order #1234 completed', user: 'Jane Smith', time: '15 min ago' },
    { id: 3, action: 'Product updated', user: 'Admin', time: '1 hour ago' },
    { id: 4, action: 'Payment received', user: 'System', time: '2 hours ago' },
    { id: 5, action: 'User role changed', user: 'Admin', time: '3 hours ago' },
  ]).pipe(delay(300), map((list) => list));

  trackByActivity(_index: number, item: ActivityItem): number {
    return item.id;
  }
}

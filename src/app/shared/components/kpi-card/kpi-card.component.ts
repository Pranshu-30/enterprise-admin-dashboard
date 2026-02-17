import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() trend?: number;

  get trendClass() {
    return {
      positive: this.trend! > 0,
      negative: this.trend! < 0
    };
  }

  get formattedTrend() {
    if (this.trend === undefined) return null;
    return `${this.trend > 0 ? '+' : ''}${this.trend}%`;
  }
}
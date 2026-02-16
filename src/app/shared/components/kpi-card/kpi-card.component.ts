import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kpi-card">
      <span class="kpi-label">{{ label }}</span>
      <span class="kpi-value">{{ value }}</span>
      @if (trend !== undefined) {
        <span class="kpi-trend" [class.positive]="trend > 0" [class.negative]="trend < 0">
          {{ trend > 0 ? '+' : '' }}{{ trend }}%
        </span>
      }
    </div>
  `,
  styles: [`
    .kpi-card {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      background: var(--kpi-bg, #f5f5f5);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .kpi-label { font-size: 0.875rem; color: var(--text-secondary, #666); }
    .kpi-value { font-size: 1.5rem; font-weight: 600; }
    .kpi-trend { font-size: 0.75rem; }
    .kpi-trend.positive { color: green; }
    .kpi-trend.negative { color: #c00; }
  `],
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() trend?: number;
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency',
  standalone: true,
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, currencyCode = 'USD', locale = 'en-US'): string {
    if (value == null || Number.isNaN(value)) return '';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  }
}

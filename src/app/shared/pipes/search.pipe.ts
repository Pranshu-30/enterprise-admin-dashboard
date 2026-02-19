import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform<T>(items: T[] | null | undefined, query: string | null | undefined, property: keyof T): T[] {
    if (!items?.length) return [];
    const q = (query ?? '').trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const val = item[property];
      return typeof val === 'string' && val.toLowerCase().includes(q);
    });
  }
}

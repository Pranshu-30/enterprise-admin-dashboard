import { Pipe, PipeTransform } from '@angular/core';

/**
 * Simple search pipe: filters items by a string property matching query (case-insensitive).
 * Use with caution on large lists; prefer server-side or component filtering for big data.
 */
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

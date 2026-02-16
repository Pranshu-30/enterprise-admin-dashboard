import { Component, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { FormatCurrencyPipe } from '../../shared/pipes/format-currency.pipe';
import type { Product } from '../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SearchPipe, FormatCurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly searchQuery = signal('');
  readonly categoryFilter = signal<string>('');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  readonly categories = computed(() => {
    const list = this.products();
    const set = new Set(list.map((p) => p.category).filter(Boolean));
    return Array.from(set) as string[];
  });

  readonly filteredProducts = computed(() => {
    let list = this.products();
    const q = this.searchQuery().trim().toLowerCase();
    const cat = this.categoryFilter();
    const order = this.sortOrder();
    if (q) {
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    }
    if (cat) {
      list = list.filter((p) => p.category === cat);
    }
    list = [...list].sort((a, b) => {
      const diff = (a.price ?? 0) - (b.price ?? 0);
      return order === 'asc' ? diff : -diff;
    });
    return list;
  });

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  onCategoryChange(value: string): void {
    this.categoryFilter.set(value);
  }

  onSortChange(): void {
    this.sortOrder.update((o) => (o === 'asc' ? 'desc' : 'asc'));
  }

  trackByProduct(_index: number, p: Product): number {
    return p.id;
  }
}

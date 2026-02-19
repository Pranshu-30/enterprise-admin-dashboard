import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { FormatCurrencyPipe } from '../../shared/pipes/format-currency.pipe';
import type { Product } from '../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, FormatCurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];

  loading = false;
  searchQuery = '';
  categoryFilter = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private productService: ProductService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (list) => {
        this.products = list;
        this.setCategories();
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => (this.loading = false),
    });
  }

  setCategories(): void {
    const set = new Set(
      this.products.map((p) => p.category).filter(Boolean)
    );
    this.categories = Array.from(set) as string[];
  }

  applyFilters(): void {
    let list = [...this.products];

    const q = this.searchQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (this.categoryFilter) {
      list = list.filter((p) => p.category === this.categoryFilter);
    }

    list.sort((a, b) => {
      const diff = (a.price ?? 0) - (b.price ?? 0);
      return this.sortOrder === 'asc' ? diff : -diff;
    });

    this.filteredProducts = list;
  }

  onSearch(value: string): void {
    this.searchQuery = value;
    this.applyFilters();
  }

  onCategoryChange(value: string): void {
    this.categoryFilter = value;
    this.applyFilters();
  }

  onSortChange(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  trackByProduct(_index: number, p: Product): number {
    return p.id;
  }

  trackByCategory(_index: number, cat: string): string {
    return cat;
  }
}
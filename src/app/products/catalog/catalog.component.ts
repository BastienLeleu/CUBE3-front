import { Component, OnInit, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProductService, GetProductsParams } from '../services/product.service';
import { Product, ProductCondition, ProductConditionLabels } from '../../core/models/product.model';

import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
    SliderModule,
    CardModule,
    ButtonModule,
    TagModule
],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  products = signal<Product[]>([]);
  
  // Filters
  searchQuery = signal('');
  selectedCategory = signal<string | null>(null);
  selectedCondition = signal<string | null>(null);
  priceRange = signal<number[]>([0, 5000]);

  categories = [
    { label: 'Toutes les catégories', value: null },
    { label: 'Cartes', value: 'Cartes' },
    { label: 'Figurines', value: 'Figurines' },
    { label: 'Musique', value: 'Musique' },
    { label: 'Livres', value: 'Livres' },
    { label: 'Horlogerie', value: 'Horlogerie' },
    { label: 'Photographie', value: 'Photographie' },
    { label: 'Numismatique', value: 'Numismatique' },
    { label: 'Jeux Vidéo', value: 'Jeux Vidéo' },
    { label: 'Philatélie', value: 'Philatélie' },
    { label: 'Antiquités', value: 'Antiquités' },
  ];

  conditionLabels = ProductConditionLabels;

  conditions = [
    { label: 'Tous les états', value: null },
    { label: ProductConditionLabels[ProductCondition.NEW], value: ProductCondition.NEW },
    { label: ProductConditionLabels[ProductCondition.VERY_GOOD], value: ProductCondition.VERY_GOOD },
    { label: ProductConditionLabels[ProductCondition.GOOD], value: ProductCondition.GOOD },
    { label: ProductConditionLabels[ProductCondition.USED], value: ProductCondition.USED },
  ];

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const params: GetProductsParams = {
      search: this.searchQuery() || undefined,
      category: this.selectedCategory() || undefined,
      condition: this.selectedCondition() || undefined,
      minPrice: this.priceRange()[0].toString(),
      maxPrice: this.priceRange()[1].toString(),
    };

    this.productService.getProducts(params).subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => {
        console.error('Failed to load products', err);
      }
    });
  }

  onFilterChange(): void {
    this.loadProducts();
  }

  getConditionSeverity(condition: ProductCondition): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    switch (condition) {
      case ProductCondition.NEW: return 'success';
      case ProductCondition.VERY_GOOD: return 'info';
      case ProductCondition.GOOD: return 'warn';
      case ProductCondition.USED: return 'danger';
      default: return 'info';
    }
  }
}

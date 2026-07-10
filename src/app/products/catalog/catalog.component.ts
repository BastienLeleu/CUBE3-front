import { Component, OnInit, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProductService, GetProductsParams } from '../services/product.service';
import { Product, ProductCondition, ProductConditionLabels } from '../../core/models/product.model';
import { CartService } from '../../cart/cart';
import { MessageService } from 'primeng/api';

import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';

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
    TagModule,
    InputNumberModule
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
  maxSliderLimit = signal<number>(5000);
  priceRange = signal<number[]>([0, 5000]);
  errorMessage = signal<string | null>(null);

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

  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

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
        this.errorMessage.set(null);
        this.products.set(data);
      },
      error: (err) => {
        this.errorMessage.set(err?.message ?? 'Impossible de charger les produits');
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

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Produit ajouté au panier' });
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de l\'ajout au panier';
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: msg });
        if (err.status === 409) {
          this.cartService.toggleCart(true);
        }
      }
    });
  }
}

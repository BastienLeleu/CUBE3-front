import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { CartComponent } from '../../cart/cart/cart';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, CartComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {
}

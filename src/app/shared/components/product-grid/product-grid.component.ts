import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { IProduct } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent
  ],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
})
export class ProductGridComponent implements OnInit {

  @Input() title: string = '';
  @Input({ required: true }) products: IProduct[] = [];

  ngOnInit(): void { }
}

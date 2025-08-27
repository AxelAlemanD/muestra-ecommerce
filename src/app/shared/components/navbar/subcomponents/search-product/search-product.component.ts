import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomButtonComponent } from '../../../custom-button/custom-button.component';
import { CustomControlComponent } from '../../../custom-control/custom-control.component';
import { ProductsService } from '../../../../../services/products.service';
import { NavigationEnd, RouterModule } from '@angular/router';
import { UploadsPipe } from '../../../../pipes/uploads.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyImageDirective } from '../../../../directives/lazy-image.directive';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UploadsPipe,
    CustomButtonComponent,
    CustomControlComponent,
    LazyImageDirective
  ],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss',
})
export class SearchProductComponent {

  relatedCategories: any[] = [];
  filteredProducts: any[] = [];
  showResults: boolean = false;
  searchTerm: string = '';
  form: FormGroup = this._formBuilder.group({
    search: null
  });
  currentRoute: string = '';

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _productsService: ProductsService,
  ) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.form.reset();
    });

    this._activatedRoute.queryParams
      .pipe(
        filter(params => Object.keys(params).length > 0),
        take(1)
      )
      .subscribe(params => {
        this.form.patchValue({
          search: (params['busqueda']) ? params['busqueda'] : null
        });
      });
  }

  filterProducts(searchTerm: string) {
    this.searchTerm = searchTerm;
    if (searchTerm) {
      this.filteredProducts = this._productsService.filter(`busqueda=${searchTerm}`);
      const categoryMap = new Map();
      this.filteredProducts.forEach(product => {
        product.categorias.forEach((category: any, index: number) => {
          if (!categoryMap.has(category.id)) {
            const MODIFIED_CATEGORY = {
              ...category,
              nombre: (index > 0) ? `${product.categorias[0].nombre} - ${category.nombre}` : category.nombre,
              url: (index === 0) ? `/categorias/${product.categorias[0].id}` : `/categorias/${product.categorias[0].id}/subcategoria/${category.id}`
            }
            categoryMap.set(category.id, MODIFIED_CATEGORY);
          }
        });
      });
      this.relatedCategories = Array.from(categoryMap.values());
    } else {
      this.filteredProducts = [];
      this.relatedCategories = [];
    }
  }

  showAllResults() {
    this.showResults = false;
    let queryParams = { ...this._activatedRoute.snapshot.queryParams };
    queryParams['busqueda'] = this.searchTerm;
    this._router.navigate(['productos'], { queryParams });
  }

  hideResults() {
    setTimeout(() => {
      this.showResults = false;
    }, 100);
  }
}

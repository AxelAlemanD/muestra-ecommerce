import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomColorRadioComponent } from '../../../../../shared/components/custom-color-radio/custom-color-radio.component';
import { CustomRadioComponent } from '../../../../../shared/components/custom-radio/custom-radio.component';

@Component({
  selector: 'app-product-variants-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomRadioComponent,
    CustomColorRadioComponent,
  ],
  templateUrl: './product-variants-form.component.html',
  styleUrl: './product-variants-form.component.scss',
})
export class ProductVariantsFormComponent implements OnInit {

  parsedVariants: any;
  form: FormGroup = this._formBuilder.group({
    size: null,
    talla: null,
    color: null,
    colorCode: null,
  });

  @Input({ required: true }) variants: any;
  @Input() selectedVariantId!: number;
  @Input() isDisabled: boolean = false;
  @Output() onSelectVariant: EventEmitter<number> = new EventEmitter();

  constructor(
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.parsedVariants = this._getParsedVariants(this.variants);
    this._loadSelectedVariant();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['variants'] && changes['variants'].currentValue) {
      this.parsedVariants = this._getParsedVariants(this.variants);
      this._loadSelectedVariant();
    }
  }

  changeSelected(type: 'size' | 'talla' | 'color' | 'colorCode', value: string) {
    if (this.form.value[type] === value) {
      this.form.controls[type].setValue(null);
    }
    const SELECTED_VARIANT_ID = this._getIdOfSelectedVariant(this.variants, this.form.value);
    if (SELECTED_VARIANT_ID) {
      this.onSelectVariant.emit(SELECTED_VARIANT_ID);
    }
  }

  get availableSizes(): string[] {
    if (!this.form.value['colorCode']) {
      return this.parsedVariants['size'];
    }

    const availableSizes: string[] = [];

    this.variants.forEach((variant: any) => {
      const variations = variant.variante;
      if (Object.values(variations).includes(this.form.value['colorCode']) && variations["size"]) {
        availableSizes.push(variations["size"]);
      }
    });
    return availableSizes;
  }

  get availableColorsHex(): string[] {
    if (!this.form.value['size']) {
      return this.parsedVariants['colorCode'];
    }

    const availableColorsHex: string[] = [];

    this.variants.forEach((variant: any) => {
      const variations = variant.variante;
      if (Object.values(variations).includes(this.form.value['size']) && variations["colorCode"]) {
        availableColorsHex.push(variations["colorCode"]);
      }
    });
    return availableColorsHex;
  }

  private _loadSelectedVariant() {
    if (this.selectedVariantId) {
      const SELECTED_VARIANT = this.variants.find((variant: any) => variant.id == this.selectedVariantId);
      this.form.patchValue({
        size: SELECTED_VARIANT.variante.size,
        talla: SELECTED_VARIANT.variante.talla,
        colorCode: SELECTED_VARIANT.variante.colorCode,
      });
    }
  }

  private _getParsedVariants(variants: any[]) {
    if (!variants || !variants.length) {
      return;
    }
    const variationGroups: any = {};
    // Iterar sobre cada objeto en el arreglo
    variants.forEach(variant => {
      // Iterar sobre las claves de variaciones de cada objeto
      for (const clave in variant.variante) {
        if (variant.variante.hasOwnProperty(clave)) {
          const valor = variant.variante[clave];
          // Si la clave no existe en el objeto de valores posibles, se crea un nuevo array
          if (!variationGroups[clave] && valor) {
            variationGroups[clave] = [valor];
          } else {
            // Si la clave ya existe, se agrega el valor al array solo si no está presente
            if (valor && !variationGroups[clave].includes(valor)) {
              variationGroups[clave].push(valor);
            }
          }
        }
      }
    });

    return variationGroups;
  }

  private _getIdOfSelectedVariant(items: any[], selectedVariation: any) {
    for (const item of items) {
      const matches: boolean[] = [];
      for (const key in selectedVariation) {
        if (selectedVariation.hasOwnProperty(key) && selectedVariation[key]) {
          const match = selectedVariation[key] === item.variante[key]
          matches.push(match);
        }
      }
      if (matches.length && matches.every(match => match === true)) {
        return item.id;
      }
    }
    return null;
  }
}

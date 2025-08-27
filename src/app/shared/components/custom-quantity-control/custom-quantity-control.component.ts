import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { AbstractControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-custom-quantity-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomButtonComponent
  ],
  templateUrl: './custom-quantity-control.component.html',
  styleUrl: './custom-quantity-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomQuantityControlComponent,
      multi: true,
    },
  ],
})
export class CustomQuantityControlComponent {
  isFocused: boolean = false;
  innerValue: number = 0;
  actionExecuted: 'none' | 'increase' | 'decrease' = 'none';
  @Input({ required: true }) id = '';
  @Input({ required: true }) name = '';
  @Input() control!: AbstractControl;
  @Input() label = '';
  @Input() min = 0;
  @Input() max!: number;
  @Output() onValueChange = new EventEmitter();
  @Output() onControlChange = new EventEmitter();
  @ViewChild('input') inputElement: ElementRef | undefined;

  private emitTimeout: any;

  constructor(
    private _alertsService: AlertsService,
  ) { }

  onChange = (value: any) => { };
  onTouched = (value: any) => { };
  onBlur = () => this.isFocused = false;
  onFocused = () => {
    this.isFocused = true;
    const input = this.inputElement!.nativeElement;
    input.select();
  };
  writeValue = (value: any) => this.innerValue = value;
  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;

  emitChange(value: any) {
    if (this.max && value > this.max) {
      value = this.max;
      this.innerValue = value;
      this.onChange(this.innerValue);
      this._showStockLimitAlert();
      // return;
    }

    if (this.emitTimeout) {
      clearTimeout(this.emitTimeout);
    }
    this.emitTimeout = setTimeout(() => {
      this.actionExecuted = 'none';
      this.onValueChange.emit(value);
    }, 1500);
  }

  emitControlChange() {
    this.onControlChange.emit();
  }

  asignValue(value: number) {
    if (value < 0) {
      this.actionExecuted = 'none';
      return;
    } else if (this.max && value > this.max) {
      this.actionExecuted = 'none';
      this._showStockLimitAlert();
      return;
    }
    this.innerValue = value;
    this.emitChange(value);
    this.onChange(this.innerValue);
    this.emitControlChange();
  }

  private _showStockLimitAlert() {
    this._alertsService.showToast({
      icon: 'error',
      text: 'Este producto no cuenta con más stock disponible'
    });
  }
}
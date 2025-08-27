import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, FormsModule } from '@angular/forms';
import 'ionicons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-radio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-radio.component.html',
  styleUrl: './custom-radio.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomRadioComponent,
      multi: true,
    },
  ],
})
export class CustomRadioComponent implements OnInit, OnDestroy {

  innerValue: any;
  isFocused: boolean = false;
  isSelected = false;

  @Input({ required: true }) id = '';
  @Input({ required: true }) label: any;
  @Input({ required: true }) value: any;
  @Input() control!: AbstractControl;
  @Input() isDisabled = false;
  @Input() isReadonly = false;
  @Input() isMultiple: boolean = false;
  @Input() showCloseIcon: boolean = false;
  @Input() theme: 'default' | 'light' = 'default';
  @Output() onValueChange = new EventEmitter();
  @Output() onClick = new EventEmitter();
  @ViewChild('input') inputElement: ElementRef | undefined;

  private _subscription!: Subscription;

  onChange = (value: any) => { };
  onTouched = (value: any) => { };
  onBlur = () => this.isFocused = false;
  onFocused = () => this.isFocused = true;
  writeValue = (value: any) => { this.innerValue = value };
  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;

  ngOnInit() {
    if (!this.control) {
      return;
    }

    if (this.isMultiple) {
      this.isSelected = this.control.value.includes(this.value + '');
    } else {
      this.isSelected = this.control.value == this.value;
      this.onValueChange.emit();
    }

    this._subscription = this.control.valueChanges.subscribe(value => {
      if (this.isMultiple) {
        this.isSelected = value.includes(this.value + '');
      } else {
        this.isSelected = value == this.value;
        this.onValueChange.emit();
      }
    })
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  emitClick() {
    this.onClick.emit();
  }
}
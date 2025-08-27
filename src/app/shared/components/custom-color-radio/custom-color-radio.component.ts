import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, FormsModule } from '@angular/forms';
import 'ionicons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-color-radio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-color-radio.component.html',
  styleUrl: './custom-color-radio.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomColorRadioComponent,
      multi: true,
    },
  ],
})
export class CustomColorRadioComponent implements OnInit, OnDestroy {

  innerValue: any;
  isFocused: boolean = false;
  isSelected = false;

  @Input({ required: true }) id = '';
  @Input() label = '';
  @Input({ required: true }) radioValue: any;
  @Input({ required: true }) control!: AbstractControl;
  @Input() isDisabled = false;
  @Input() isReadonly = false;
  @Output() onValueChange = new EventEmitter();
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
    this._subscription = this.control.valueChanges.subscribe(value => {
      this.isSelected = value == this.radioValue;
      this.onValueChange.emit();
    })
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
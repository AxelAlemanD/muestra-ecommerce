import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-checkbox.component.html',
  styleUrl: './custom-checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomCheckboxComponent,
      multi: true,
    },
  ],
})
export class CustomCheckboxComponent implements OnInit, OnDestroy {

  innerValue: any;
  isFocused: boolean = false;
  isSelected = false;

  @Input({ required: true }) id = '';
  @Input() label: any;
  @Input({ required: true }) value: any;
  @Input({ required: true }) control!: AbstractControl;
  @Input() isDisabled = false;
  @Input() isReadonly = false;
  @Input() isMultiple: boolean = false;
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
    if (this.isMultiple) {
      this.isSelected = this.control.value.includes(this.value+'');
    } else {
      this.isSelected = this.control.value == this.value;
      this.onValueChange.emit();
    }

    this._subscription = this.control.valueChanges.subscribe(value => {
      if (this.isMultiple) {
        this.isSelected = value.includes(this.value+'');
      } else {
        this.isSelected = value == this.value;
        this.onValueChange.emit();
      }
    })
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  emitClick() {
    this.onClick.emit();
  }
}
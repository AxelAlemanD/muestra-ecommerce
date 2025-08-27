import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, FormsModule } from '@angular/forms';
import 'ionicons';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ICustomButton } from '../../../interfaces/custom-button.interface';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { errorMessages } from '../../../utils/error-messages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomButtonComponent,
    ValidationPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-control.component.html',
  styleUrl: './custom-control.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomControlComponent,
      multi: true,
    },
  ],
})
export class CustomControlComponent implements OnInit, OnDestroy {

  isFocused = false;
  isRequired = false;
  errorMessages = errorMessages;
  @Input() innerValue: any;
  @Input({ required: true }) id = '';
  @Input({ required: true }) name = '';
  @Input({ required: true }) type: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'tel' = 'text';
  @Input() control!: AbstractControl;
  @Input() value: any;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() button: ICustomButton | undefined;
  @Input() min = 0;
  @Input() max!: number;
  @Input() rows = 4;
  @Input() minLength: null | number = null;
  @Input() maxLength: null | number = null;
  @Input() isDisabled = false;
  @Input() isReadonly = false;
  @Input() isResizable = false;
  @Input() buttonAlwaysEnabled = false;
  @Output() onValueChange = new EventEmitter();
  @Output() onClickButton = new EventEmitter();
  @Output() onFocus = new EventEmitter();
  @Output() onLossFocus = new EventEmitter();
  @ViewChild('input') inputElement: ElementRef | undefined;

  private _subscription!: Subscription;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.validateControlConfig();
    this.isRequired = this._hasTheRequiredValidator();
    if (this.value) {
      this.innerValue = this.value;
    }

    if (this.control) {
      this._subscription = this.control.valueChanges.subscribe(value => {
        this.cd.markForCheck();
      });
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  onChange = (value: any) => { };
  onTouched = (value: any) => { };
  onBlur = () => {
    this.isFocused = false;
    this.onLossFocus.emit();
  }
  onFocused = () => {
    this.isFocused = true;
    this.onFocus.emit();
  };
  writeValue = (value: any) => this.innerValue = value;
  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;

  validateControlConfig() {
    if (this.button) {
      if (this.type === 'textarea') {
        throw new Error('The append is not available when the tipo is textarea. Set another tipo or set tieneAppend = false.');
      }
    }
    if (this.type !== 'textarea' && this.isResizable) {
      throw new Error('The resizable option is only available when the tipo is textarea. Set tipo = textarea or set isResizable = false.');
    }
    if (this._hasMaxLengthValidator() && this.maxLength === 0) {
      throw new Error('The control has the maxLength validator, set the same value for maxLength of this component.');
    }
  }

  emitChange(value: string) {
    this.onValueChange.emit(value);
  }

  emitClick() {
    this.onClickButton.emit();
  }

  private _hasTheRequiredValidator(): boolean {
    if (this.control && this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      return validator && validator['required'];
    }
    return false;
  }

  private _hasMaxLengthValidator(): boolean {
    if (this.control && this.control.validator) {
      const stringValidators = this.control.validator.toString();
      return stringValidators.includes('\'requiredLength\': maxLength');
    }
    return false;
  }
}
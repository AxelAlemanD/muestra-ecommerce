import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, AbstractControl } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import 'ionicons';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { errorMessages } from '../../../utils/error-messages';
import { ICustomButton } from '../../../interfaces/custom-button.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomButtonComponent,
    ValidationPipe,
    NgSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectComponent,
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  errorMessages = errorMessages;

  @Input({ required: true }) bindLabel!: string;
  @Input({ required: true }) bindValue!: string;
  @Input({ required: true }) items: any[] = [];
  @Input({ required: true }) control: AbstractControl | undefined;
  @Input({ required: true }) id = '';
  @Input({ required: true }) name = '';
  @Input() label = '';
  @Input() placeholder = 'Seleccionar';
  @Input() isRequired = false;
  @Input() isReadonly = false;
  @Input() isDisabled = false;
  @Input() isClearable = false;
  @Input() isMultiple = false;
  @Input() isSearchable = false;
  @Input() button!: ICustomButton;
  @Input() searchFn!: (o1: any, o2: any) => boolean;

  @Output() onClear = new EventEmitter();
  @Output() onValueChange = new EventEmitter();
  @Output() onInput = new EventEmitter();
  @Output() onClickButton = new EventEmitter();

  value: string | undefined;

  private _subscription!: Subscription;

  onChange!: (value: string) => void;
  onTouched!: (value: any) => void;

  @ViewChild('select')
  select!: NgSelectComponent;

  ngOnInit(): void {
    if (this.control) {
      this.isRequired = this._hasTheRequiredValidator();
      this._subscription = this.control.valueChanges.subscribe((newValue) => {
        this.value = newValue
      });
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  writeValue(obj: any) {
    this.value = obj;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  openSelect(select: NgSelectComponent) {
    select.open();
  }

  closeSelect(select: NgSelectComponent) {
    select.close();
  }

  emitClick() {
    this.onClickButton.emit();
  }

  emitClear(event: any) {
    this.onClear.emit(event);
  }

  emitChange(event: any) {
    this.onValueChange.emit(event);
  }

  clearSelect() {
    this.select.handleClearClick();
  }

  emitInput(event: any) {
    this.onInput.emit(event.term);
  }

  focus() {
    this.select.focus();
  }

  private _hasTheRequiredValidator(): boolean {
    if (this.control && this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      return validator && validator['required'];
    }
    return false;
  }
}

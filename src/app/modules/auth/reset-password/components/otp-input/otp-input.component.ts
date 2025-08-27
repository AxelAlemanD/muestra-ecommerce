import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CustomControlComponent } from '../../../../../shared/components/custom-control/custom-control.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [
    CommonModule,
    CustomControlComponent
  ],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent {

  value: {
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
  } = {
      opt1: '',
      opt2: '',
      opt3: '',
      opt4: '',
    };
  @Output() onOtpChange: EventEmitter<number> = new EventEmitter();

  nextInput(currentCustomControl: CustomControlComponent, nextCustomControl: CustomControlComponent) {
    const TARGET = currentCustomControl.inputElement!.nativeElement;
    const VALUE = TARGET.value;

    if (!VALUE) {
      return;
    }
    if (isNaN(VALUE)) {
      TARGET.value = "";
      return;
    }
    if (VALUE != "") {
      const NEXT = nextCustomControl.inputElement!.nativeElement;
      if (NEXT) {
        NEXT.focus();
      }
    }
  }

  previousInput(currentCustomControl: CustomControlComponent, previousCustomControl: CustomControlComponent) {
    const TARGET = currentCustomControl.inputElement!.nativeElement;

    TARGET.value = "";
    const PREV = previousCustomControl.inputElement!.nativeElement;
    if (PREV) {
      PREV.focus();
    }
    return;
  }

  emitValue() {
    const OPT = Object.values(this.value).join('');
    if (OPT) {
      this.onOtpChange.emit(parseInt(OPT));
    }
  }

}

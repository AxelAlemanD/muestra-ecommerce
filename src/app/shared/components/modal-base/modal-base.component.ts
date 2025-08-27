import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ICustomButtonModal } from '../../../interfaces/custom-button.interface';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-base',
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonComponent
  ],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalBaseComponent {

  @Input() title = '';
  @Input() hasHideBtn = false;
  @Input() cancelBtnText = '';
  @Input() confirmBtnText = '';
  @Input() disableConfirmBtn: boolean = false;
  @Input() buttons: ICustomButtonModal[] = [
    {
      color: 'dark',
      text: (this.cancelBtnText) ? this.cancelBtnText : 'Cancelar',
      fill: 'clear',
      role: 'cancel',
      action: () => this.hideModal()
    },
    {
      color: 'primary',
      text: (this.confirmBtnText) ? this.confirmBtnText : 'Confirmar',
      fill: 'solid',
      role: 'confirm',
      action: () => {
        this.onConfirm.emit();
        // this.hideModal();
      }
    }
  ];
  @Output() onConfirm = new EventEmitter();

  constructor(
    private _modalRef: BsModalRef,
  ) { }

  ngOnInit() {
    if (this.confirmBtnText) {
      const CONFIRM_BUTTON = this.buttons.find(button => button.role === 'confirm')!;
      CONFIRM_BUTTON.text = this.confirmBtnText;
    }

    if (this.cancelBtnText) {
      const CANCEL_BUTTON = this.buttons.find(button => button.role === 'cancel')!;
      CANCEL_BUTTON.text = this.cancelBtnText;
    }
  }

  hideModal() {
    this._modalRef.hide()
  }
}

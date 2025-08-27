import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentIntent, StripeElementsOptions } from '@stripe/stripe-js';
import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { ModalBaseComponent } from '../../../../shared/components/modal-base/modal-base.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertsService } from '../../../../services/alerts.service';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-payment-card-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StripePaymentElementComponent,
    ModalBaseComponent,
    CustomButtonComponent,
  ],
  templateUrl: './add-payment-card-modal.component.html',
  styleUrl: './add-payment-card-modal.component.scss',
})
export class AddPaymentCardModalComponent implements OnInit {

  elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'flat',
      variables: {
        fontFamily: ' "Gill Sans", sans-serif',
        fontLineHeight: '1.5',
        borderRadius: '0px',
        colorBackground: '#FFF',
        colorPrimaryText: '#262626',
        colorPrimary: '#EB4944',
      },
      rules: {
        '.Block': {
          backgroundColor: 'var(--colorBackground)',
          boxShadow: 'none',
          padding: '12px',
        },
        '.Input': {
          padding: '12px',
          borderRadius: '8px',
          borderBottom: '1.5px solid #A4A4A4',
        },
        '.Input:disabled, .Input--invalid:disabled': {
          color: 'lightgray',
        },
        '.Tab': {
          padding: '10px 12px 8px 12px',
          border: 'none',
        },
        '.Tab:hover': {
          border: 'none',
          boxShadow:
            '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
        },
        '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
          border: 'none',
          backgroundColor: '#fff',
          boxShadow:
            '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
        },
        '.Label': {
          fontWeight: '500',
          color: '#ffffff',
        },
      },
    }
  };

  errorPayment = false;
  form = this._formBuilder.group({
    name: [''],
  });
  paying = false;
  loading = true;

  @Input({ required: true }) client_secret!: string;
  @Output() onSuccessPayment: EventEmitter<PaymentIntent> = new EventEmitter();
  @ViewChild(StripePaymentElementComponent) paymentElement?: StripePaymentElementComponent;

  constructor(
    private _modalRef: BsModalRef,
    private readonly _formBuilder: FormBuilder,
    private readonly stripeService: StripeService,
    private _alertsService: AlertsService,
  ) { }

  ngOnInit() {
    this.elementsOptions.clientSecret = this.client_secret;
    this.elementsOptions.locale = 'es';
  }

  pay() {
    if (!this.form.valid) {
      return;
    }

    this.paymentElement?.elements?.submit();

    this.paying = true;

    this.stripeService
      .confirmPayment({
        elements: this.paymentElement?.elements,
        clientSecret: this.elementsOptions?.clientSecret || '',
        redirect: 'if_required',
        confirmParams: {
          return_url: '',
          payment_method_data: {
            billing_details: {
              name: this.form.get('name')?.value || '',
            },
          },
        },
      })
      .pipe(take(1))
      .subscribe({
        next: async (result) => {
          this.paying = false;
          if (result.error) {
            this._alertsService.showToast({
              icon: 'error',
              text: 'Hubo un error al realizar el pago con tarjeta, intente de nuevo'
            });
            return;
          }

          if (result.paymentIntent?.status === 'succeeded') {
            this._alertsService.showToast({
              icon: 'success',
              text: 'Pago realizado con éxito'
            });
            this.onSuccessPayment.emit(result.paymentIntent);
            this._modalRef.hide();
          } else {
            this._alertsService.showToast({
              icon: 'error',
              text: 'Hubo un error al realizar el pago con tarjeta, intente de nuevo'
            });
          }
        },
        error: async (err) => {
          this.paying = false;
          this._alertsService.showToast({
            icon: 'error',
            text: 'Hubo un error al realizar el pago con tarjeta'
          });
        },
      });
  }

  closeModal() {
    this._modalRef.hide();
  }
}
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {

  private _toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 3000,
    customClass: {},
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  private _card = Swal.mixin({
    timerProgressBar: true,
    showCancelButton: true,
    showConfirmButton: true,
    allowOutsideClick: false,
    cancelButtonText: 'No, cancelar',
    confirmButtonText: 'Si, confirmar',
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-clear btn-dark"
    },
  });

  constructor() { }

  showToast(toast: {
    text: string,
    icon: 'success' | 'error' | 'info' | 'warning',
    title?: string,
  }) {
  this._toast.fire({
    icon: toast.icon,
    title: toast.title,
    html: toast.text,
  });
}

showConfirmationAlert(
  alert: {
  title: string;
  message?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
}
) {
  return this._card.fire({
    title: alert.title,
    html: alert.message,
    cancelButtonText: alert.cancelButtonText ?? 'No, cancelar',
    confirmButtonText: alert.confirmButtonText ?? 'Si, confirmar',
  });
}

}

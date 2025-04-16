// src/app/services/alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() {}

  // Alerta básica
  showAlert(title: string, message: string, icon: SweetAlertIcon = 'info') {
    return Swal.fire({
      title,
      text: message,
      icon,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3f51b5'
    });
  }

  // Toast (notificación pequeña)
  showToast(message: string, icon: SweetAlertIcon = 'success', timer: number = 3000) {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }

  // Confirmación
  showConfirm(title: string, message: string, confirmText: string = 'Sí', cancelText: string = 'No', icon: SweetAlertIcon = 'question') {
    return Swal.fire({
      title,
      text: message,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#f44336',
      reverseButtons: true
    });
  }

  // Alerta de éxito
  success(message: string, title: string = '¡Éxito!') {
    return this.showAlert(title, message, 'success');
  }

  // Alerta de error
  error(message: string, title: string = 'Error') {
    return this.showAlert(title, message, 'error');
  }

  // Alerta de advertencia
  warning(message: string, title: string = 'Advertencia') {
    return this.showAlert(title, message, 'warning');
  }

  // Alerta de información
  info(message: string, title: string = 'Información') {
    return this.showAlert(title, message, 'info');
  }

  // Toast de éxito
  successToast(message: string) {
    return this.showToast(message, 'success');
  }

  // Toast de error
  errorToast(message: string) {
    return this.showToast(message, 'error');
  }

  // Toast de advertencia
  warningToast(message: string) {
    return this.showToast(message, 'warning');
  }

  // Toast de información
  infoToast(message: string) {
    return this.showToast(message, 'info');
  }

  // Alerta con input
  async prompt(title: string, inputPlaceholder: string, inputValue: string = ''): Promise<string | null> {
    const result = await Swal.fire({
      title,
      input: 'text',
      inputPlaceholder,
      inputValue,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3f51b5',
      cancelButtonColor: '#f44336'
    });

    return result.isConfirmed ? result.value : null;
  }

  // Alerta personalizada
  custom(options: SweetAlertOptions) {
    return Swal.fire(options);
  }
}
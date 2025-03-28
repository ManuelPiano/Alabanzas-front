import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService); // Inyectar el servicio LoaderService
  loaderService.setLoading(true); // Activar el estado de carga

  return next(req).pipe(
    finalize(() => {
      loaderService.setLoading(false); // Desactivar el estado de carga al finalizar
    })
  );
};
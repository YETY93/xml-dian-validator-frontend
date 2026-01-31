import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        switch (error.status) {
          case 0:
            errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Solicitud incorrecta';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      return throwError(() => new Error(errorMessage));
    }),
  );
};

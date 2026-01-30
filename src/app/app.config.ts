import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import es from '@angular/common/locales/es';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNzI18n(es_ES),
    provideHttpClient(withInterceptors([errorInterceptor])),
  ],
};

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import es from '@angular/common/locales/es';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  CheckCircleOutline,
  MoonOutline,
  SafetyCertificateFill,
  SunOutline,
} from '@ant-design/icons-angular/icons';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(es);

const icons = [SafetyCertificateFill, CheckCircleOutline, MoonOutline, SunOutline];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNzI18n(es_ES),
    provideNzIcons(icons),
    provideHttpClient(withInterceptors([errorInterceptor])),
  ],
};

import { Routes } from '@angular/router';

export const VALIDATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./validation.component').then((m) => m.ValidationComponent),
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'validation', pathMatch: 'full' },
  {
    path: 'validation',
    loadChildren: () =>
      import('./features/validation/validation.routes').then((m) => m.VALIDATION_ROUTES),
  },
  { path: '**', redirectTo: 'validation' },
];

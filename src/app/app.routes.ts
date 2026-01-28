import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'validation', pathMatch: 'full' },
  {
    path: 'validation',
    loadComponent: () =>
      import('./features/validation/validation.component').then((m) => m.ValidationComponent),
  },
  { path: '**', redirectTo: 'validation' },
];

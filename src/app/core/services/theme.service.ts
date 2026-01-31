import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    theme = signal<Theme>('light');

    constructor() {
        // 1. Cargar preferencia guardada o detectar del sistema
        const savedTheme = localStorage.getItem('theme') as Theme;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.theme.set(savedTheme);
        } else if (systemDark) {
            this.theme.set('dark');
        }

        // 2. Aplicar el tema al DOM cuando la señal cambie
        effect(() => {
            const currentTheme = this.theme();
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    toggleTheme(): void {
        this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
    }
}

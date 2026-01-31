import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzHeaderComponent } from 'ng-zorro-antd/layout';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, NzHeaderComponent, NzIconModule],
  standalone: true,
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);

  get isDarkTheme(): boolean {
    return this.themeService.theme() === 'dark';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

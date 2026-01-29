import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzContentComponent, NzFooterComponent, NzLayoutComponent } from 'ng-zorro-antd/layout';

import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    NzLayoutComponent,
    NzContentComponent,
    NzFooterComponent,
    NzIconModule,
    HeaderComponent,
  ],
})
export class App {
  protected readonly title = signal('dian-xml-validator-front');
}

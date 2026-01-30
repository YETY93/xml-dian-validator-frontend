import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { DocumentType } from '../../data/enums/document-type.enum';

@Component({
  selector: 'app-validation-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzIconModule,
    NzSpaceModule,
  ],
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.scss'],
})
export class ValidationFormComponent {
  documentType = input<DocumentType>(DocumentType.INVOICE);
  technicalKey = input<string>('');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  documentTypeChange = output<DocumentType>();
  technicalKeyChange = output<string>();
  validate = output<void>();
  clear = output<void>();

  protected readonly DocumentType = DocumentType;

  onDocumentTypeChange(value: DocumentType): void {
    this.documentTypeChange.emit(value);
  }

  onTechnicalKeyChange(value: string): void {
    this.technicalKeyChange.emit(value);
  }

  onValidate(): void {
    this.validate.emit();
  }

  onClear(): void {
    this.clear.emit();
  }
}

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import {
  DocumentType,
  ErrorStatus,
  ValidationErrorType,
  ValidationIssue,
  XmlValidationService,
} from './data';
import { FileUploadComponent, ValidationFormComponent, ValidationResultsComponent } from './ui';
import { log } from 'ng-zorro-antd/core/logger';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFormModule,
    NzTagComponent,
    NzAlertModule,
    NzDividerModule,
    NzIconModule,
    NzSpinModule,
    FileUploadComponent,
    ValidationFormComponent,
    ValidationResultsComponent,
  ],
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
})
export class ValidationComponent {
  private service = inject(XmlValidationService);
  private destroyRef = inject(DestroyRef);

  // State signals
  documentType = signal<DocumentType>(DocumentType.INVOICE);
  xml = signal<string>('');
  technicalKey = signal<string>('');
  fileName = signal<string>('');
  fileLoaded = signal<boolean>(false);
  loading = signal<boolean>(false);
  validated = signal<boolean>(false);
  maxSeverity = signal<ErrorStatus | null>(null);
  errorsByType = signal<Record<ValidationErrorType, ValidationIssue[]>>({
    [ValidationErrorType.XSD]: [],
    [ValidationErrorType.SEMANTIC]: [],
    [ValidationErrorType.SIGNATURE]: [],
  });
  errors = signal<{ type: ErrorStatus; message: string }[]>([]);

  // Computed
  protected readonly ErrorStatus = ErrorStatus;
  protected readonly DocumentType = DocumentType;

  canValidate = computed(() => this.xml().length > 0 && !this.loading());

  // Event handlers
  onFileSelected(event: { content: string; file: NzUploadFile }): void {
    this.xml.set(event.content);
    this.fileName.set(event.file.name);
    this.fileLoaded.set(true);
    this.errors.set([]);
  }

  onFileReset(): void {
    this.reset();
  }

  onDocumentTypeChange(type: DocumentType): void {
    this.documentType.set(type);
  }

  onTechnicalKeyChange(key: string): void {
    this.technicalKey.set(key);
  }

  onValidate(): void {
    if (!this.xml()) return;

    this.loading.set(true);
    this.validated.set(false);
    this.errors.set([]);
    this.errorsByType.set({
      [ValidationErrorType.XSD]: [],
      [ValidationErrorType.SEMANTIC]: [],
      [ValidationErrorType.SIGNATURE]: [],
    });

    this.service
      .validateXml({
        documentType: this.documentType(),
        xml: this.xml(),
        technicalKey: this.technicalKey(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.maxSeverity.set(data.maxSeverity);

          const grouped: Record<ValidationErrorType, ValidationIssue[]> = {
            [ValidationErrorType.XSD]: [],
            [ValidationErrorType.SEMANTIC]: [],
            [ValidationErrorType.SIGNATURE]: [],
          };

          data.errors.forEach((error) => {
            grouped[error.type].push(error);
          });

          this.errorsByType.set(grouped);
          this.validated.set(true);
          this.loading.set(false);
        },
        error: (err: Error) => {
          this.loading.set(false);
          this.errors.set([
            {
              type: ErrorStatus.ERROR,
              message: err.message || 'Error de conexión con el servidor de validación.',
            },
          ]);
        },
      });
  }

  onClear(): void {
    this.reset();
  }

  private reset(): void {
    this.xml.set('');
    this.fileLoaded.set(false);
    this.validated.set(false);
    this.maxSeverity.set(null);
    this.fileName.set('');
    this.technicalKey.set('');
    this.errors.set([]);
    this.errorsByType.set({
      [ValidationErrorType.XSD]: [],
      [ValidationErrorType.SEMANTIC]: [],
      [ValidationErrorType.SIGNATURE]: [],
    });
  }

  onFileError(message: string) {
    this.errorsByType.update((errors) => ({
      ...errors,
      XSD: [
        {
          type: ValidationErrorType.XSD,
          severity: ErrorStatus.ERROR,
          message,
        },
      ],
    }));
  }
}

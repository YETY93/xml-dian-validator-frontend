import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

import { EstatusErrorEnum } from '../../core/models/enums/status-error-enum';
import { TypeDocumentEnum } from '../../core/models/enums/type-doucument-enum';
import { ValidationErrorType } from '../../core/models/enums/validation-errorType-enum';
import { ValidationIssue } from '../../core/models/validation-issue.model';
import { XmlvalidationsService } from '../../core/services/xml-validation.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzTagComponent,
    NzCollapseModule,
    NzUploadModule,
    NzGridModule,
    NzIconModule,
    NzResultModule,
    NzDividerModule,
    NzSpaceModule,
    NzSpinModule,
  ],
})
export class ValidationComponent {
  private service = inject(XmlvalidationsService);
  private destroyRef = inject(DestroyRef);

  documentType = signal<TypeDocumentEnum>(TypeDocumentEnum.INVOICE);
  xml = signal<string>('');
  technicalKey = signal<string>('');
  errors = signal<{ type: EstatusErrorEnum; message: string }[]>([]);
  maxSeverity = signal<EstatusErrorEnum | null>(null);
  errorsByType = signal<Record<ValidationErrorType, ValidationIssue[]>>({
    XSD: [],
    SEMANTIC: [],
    SIGNATURE: [],
  });
  fileLoaded = signal<boolean>(false);
  loading = signal<boolean>(false);
  validated = signal<boolean>(false);
  fileName = signal<string>('');

  protected readonly TypeDocumentEnum = TypeDocumentEnum;
  protected readonly EstatusErrorEnum = EstatusErrorEnum;

  validate() {
    if (!this.xml()) return;
    this.loading.set(true);
    this.validated.set(false);
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
        error: (err) => {
          this.loading.set(false);
          this.errors.set([
            {
              type: EstatusErrorEnum.ERROR,
              message:
                err?.error?.message ||
                'Error de conexión con el servidor de validación. Por favor, intente nuevamente.',
            },
          ]);
        },
      });
    this.errors.set([]);
  }

  reset() {
    this.xml.set('');
    this.fileLoaded.set(false);
    this.validated.set(false);
    this.maxSeverity.set(null);
    this.fileName.set('');
    this.errors.set([]);
    this.errorsByType.set({
      [ValidationErrorType.XSD]: [],
      [ValidationErrorType.SEMANTIC]: [],
      [ValidationErrorType.SIGNATURE]: [],
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const isXml = file.type === 'text/xml' || file.name.endsWith('.xml');
    if (!isXml) {
      this.errors.set([
        {
          type: EstatusErrorEnum.ERROR,
          message: 'El archivo seleccionado no es un XML válido.',
        },
      ]);
      return false;
    }

    this.fileName.set(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      this.xml.set(reader.result as string);
      this.fileLoaded.set(true);
    };
    reader.readAsText(file as unknown as File);
    return false; // Prevent auto-upload
  };

  getSeverityColor(severity: EstatusErrorEnum): string {
    switch (severity) {
      case EstatusErrorEnum.ERROR:
        return 'red';
      case EstatusErrorEnum.WARNING:
        return 'orange';
      case EstatusErrorEnum.INFO:
        return 'green';
      default:
        return 'default';
    }
  }

  getSeverityLabel(severity: EstatusErrorEnum): string {
    switch (severity) {
      case EstatusErrorEnum.ERROR:
        return 'Documento Inválido';
      case EstatusErrorEnum.WARNING:
        return 'Documento con Advertencias';
      case EstatusErrorEnum.INFO:
        return 'Documento Válido';
      default:
        return '';
    }
  }

  hasAnyErrors = computed(() => {
    const e = this.errorsByType();
    return e.XSD.length > 0 || e.SEMANTIC.length > 0 || e.SIGNATURE.length > 0;
  });
}

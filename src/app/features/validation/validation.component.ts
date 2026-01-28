import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { XmlvalidationsService } from '../../core/services/xml-validation.service';
import { TypeDocumentEnum } from '../../core/models/enums/type-doucument-enum';
import { EstatusErrorEnum } from '../../core/models/enums/status-error-enum';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { ValidationErrorType } from '../../core/models/enums/validation-errorType-enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationIssue } from '../../core/models/validation-issue.model';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

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

  protected readonly TypeDocumentEnum = TypeDocumentEnum;

  validate() {
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
      .subscribe((response) => {
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
      });
    this.errors.set([]);
  }

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
        return '❌ Documento inválido';
      case EstatusErrorEnum.WARNING:
        return '⚠️ Documento con advertencias';
      case EstatusErrorEnum.INFO:
        return '✅ Documento válido';
    }
  }

  hasAnyErrors = computed(() => {
    const e = this.errorsByType();
    return e.XSD.length > 0 || e.SEMANTIC.length > 0 || e.SIGNATURE.length > 0;
  });

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.xml')) {
      this.errors.set([
        {
          type: EstatusErrorEnum.ERROR,
          message: 'El archivo seleccionado no es un XML válido.',
        },
      ]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      this.xml.set(content);
      this.fileLoaded.set(true);
    };
    reader.onerror = () => {
      this.errors.set([
        {
          type: EstatusErrorEnum.ERROR,
          message: 'Error al leer el contenido del archivo.',
        },
      ]);
    };
    reader.readAsText(file);
  }
}

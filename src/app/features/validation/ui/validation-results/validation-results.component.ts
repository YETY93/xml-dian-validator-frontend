import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTagComponent } from 'ng-zorro-antd/tag';

import { ErrorStatus } from '../../data/enums/error-status.enum';
import { ValidationErrorType } from '../../data/enums/validation-error-type.enum';
import { ValidationIssue } from '../../data/models/validation-issue.model';

@Component({
  selector: 'app-validation-results',
  standalone: true,
  imports: [
    CommonModule,
    NzResultModule,
    NzDividerModule,
    NzCollapseModule,
    NzAlertModule,
    NzTagComponent,
    NzIconModule,
  ],
  templateUrl: './validation-results.component.html',
  styleUrls: ['./validation-results.component.scss'],
})
export class ValidationResultsComponent {
  maxSeverity = input<ErrorStatus | null>(null);
  errorsByType = input<Record<ValidationErrorType, ValidationIssue[]>>({
    [ValidationErrorType.XSD]: [],
    [ValidationErrorType.SEMANTIC]: [],
    [ValidationErrorType.SIGNATURE]: [],
  });

  protected readonly ErrorStatus = ErrorStatus;
  protected readonly ValidationErrorType = ValidationErrorType;

  hasAnyErrors = computed(() => {
    const errors = this.errorsByType();
    return errors.XSD.length > 0 || errors.SEMANTIC.length > 0 || errors.SIGNATURE.length > 0;
  });

  getSeverityColor(severity: ErrorStatus): string {
    switch (severity) {
      case ErrorStatus.FATAL:
        return 'red';
      case ErrorStatus.ERROR:
        return 'red';
      case ErrorStatus.WARNING:
        return 'orange';
      case ErrorStatus.INFO:
        return 'green';
      default:
        return 'default';
    }
  }

  getSeverityLabel(severity: ErrorStatus): string {
    switch (severity) {
      case ErrorStatus.FATAL:
        return 'Documento Críticamente Inválido';
      case ErrorStatus.ERROR:
        return 'Documento Inválido';
      case ErrorStatus.WARNING:
        return 'Documento con Advertencias';
      case ErrorStatus.INFO:
        return 'Documento Válido';
      default:
        return '';
    }
  }

  getAlertType(severity: ErrorStatus): 'success' | 'info' | 'warning' | 'error' {
    switch (severity) {
      case ErrorStatus.INFO:
        return 'info';
      case ErrorStatus.WARNING:
        return 'warning';
      case ErrorStatus.ERROR:
      case ErrorStatus.FATAL:
        return 'error';
      default:
        return 'info';
    }
  }
}

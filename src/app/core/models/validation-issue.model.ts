import { EstatusErrorEnum } from './enums/status-error-enum';
import { ValidationErrorType } from './enums/validation-errorType-enum';

export interface ValidationIssue {
  type: ValidationErrorType;
  severity: EstatusErrorEnum;
  message: string;
}

import { ErrorStatus } from '../enums/error-status.enum';
import { ValidationErrorType } from '../enums/validation-error-type.enum';

export interface ValidationIssue {
  type: ValidationErrorType;
  severity: ErrorStatus;
  message: string;
}

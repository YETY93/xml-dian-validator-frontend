import { ValidationIssue } from './validation-issue.model';
import { ErrorStatus } from '../enums/error-status.enum';

export interface ValidationResult {
  valid: boolean;
  maxSeverity: ErrorStatus;
  errors: ValidationIssue[];
}

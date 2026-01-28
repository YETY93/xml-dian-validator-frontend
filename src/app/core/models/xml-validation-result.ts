import { EstatusErrorEnum } from "./enums/status-error-enum";
import { ValidationIssue } from "./validation-issue.model";

export interface XmlValidationResult {
  valid: boolean;
  maxSeverity: EstatusErrorEnum;
  errors: ValidationIssue[];
}

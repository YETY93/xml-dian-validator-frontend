import { EstatusErrorEnum } from "./enums/status-error-enum";

export interface XmlValidationResponse {
  success: boolean;
  status: string;
  action: string;
  errors: string[];
  maxSeverity: EstatusErrorEnum;
}

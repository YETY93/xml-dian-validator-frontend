import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ValidationRequest } from '../models/validation-request.model';
import { ValidationResult } from '../models/validation-result.model';

@Injectable({
  providedIn: 'root',
})
export class XmlValidationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}${environment.apiEndpoints.xmlValidation}`;

  validateXml(request: ValidationRequest): Observable<ApiResponse<ValidationResult>> {
    return this.http.post<ApiResponse<ValidationResult>>(this.apiUrl, request);
  }
}

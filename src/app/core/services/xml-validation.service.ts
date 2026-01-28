import { Injectable, inject } from '@angular/core';
import { XmlValidationRequest } from '../models/xml-validation-request.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { XmlValidationResult } from '../models/xml-validation-result';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class XmlvalidationsService {
  private readonly API_BASE_URL = 'http://localhost:8080';
  private readonly API_URL = '/api/xml/validate';
  private readonly http = inject(HttpClient);

  validateXml(request: XmlValidationRequest): Observable<ApiResponse<XmlValidationResult>> {
    const url = `${this.API_BASE_URL}${this.API_URL}`;
    return this.http.post<ApiResponse<XmlValidationResult>>(url, request);
  }
}

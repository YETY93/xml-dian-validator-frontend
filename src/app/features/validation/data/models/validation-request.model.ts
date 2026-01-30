import { DocumentType } from '../enums/document-type.enum';

export interface ValidationRequest {
  documentType: DocumentType;
  xml: string;
  technicalKey?: string;
}

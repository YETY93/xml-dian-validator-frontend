import { TypeDocumentEnum } from './enums/type-doucument-enum';

export interface XmlValidationRequest {
  documentType: TypeDocumentEnum;
  xml: string;
  technicalKey?: string;
}

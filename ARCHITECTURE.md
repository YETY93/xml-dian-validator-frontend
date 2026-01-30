# Arquitectura del Proyecto - DIAN XML Validator

## Resumen

Este proyecto es un validador de documentos XML para la DIAN (Dirección de Impuestos y Aduanas Nacionales de Colombia), construido con **Angular 21** utilizando la arquitectura moderna de **Standalone Components**.

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── core/                          # Singletons de aplicación
│   │   └── interceptors/
│   │       └── error.interceptor.ts   # Manejo global de errores HTTP
│   │
│   ├── features/                      # Features independientes (lazy-loaded)
│   │   └── validation/
│   │       ├── data/                  # Capa de acceso a datos
│   │       │   ├── enums/             # Enums del dominio
│   │       │   │   ├── document-type.enum.ts
│   │       │   │   ├── error-status.enum.ts
│   │       │   │   └── validation-error-type.enum.ts
│   │       │   ├── models/            # Modelos del dominio
│   │       │   │   ├── api-response.model.ts
│   │       │   │   ├── validation-issue.model.ts
│   │       │   │   ├── validation-request.model.ts
│   │       │   │   └── validation-result.model.ts
│   │       │   ├── services/          # Servicios del feature
│   │       │   │   └── xml-validation.service.ts
│   │       │   └── index.ts           # Barrel export
│   │       │
│   │       ├── ui/                    # Componentes de presentación (dumb)
│   │       │   ├── file-upload/
│   │       │   ├── validation-form/
│   │       │   ├── validation-results/
│   │       │   └── index.ts
│   │       │
│   │       ├── validation.component.ts      # Smart component (container)
│   │       ├── validation.component.html
│   │       ├── validation.component.scss
│   │       └── validation.routes.ts
│   │
│   ├── shared/                        # Componentes/utilidades compartidas
│   │   └── components/
│   │       └── header/
│   │
│   ├── app.config.ts                  # Configuración standalone
│   ├── app.routes.ts                  # Rutas principales
│   ├── app.component.ts               # Componente raíz
│   ├── app.component.html
│   └── app.component.scss
│
├── environments/                      # Configuración de entornos
│   ├── environment.ts                 # Desarrollo
│   └── environment.prod.ts            # Producción
│
├── index.html
└── main.ts
```

---

## Principios Arquitectónicos

### 1. Standalone Components
- Sin `NgModule` tradicionales
- Cada componente define sus propios imports
- Bootstrap mediante `bootstrapApplication()`

### 2. Feature-Based Organization
Cada feature es auto-contenido con:
- `data/`: Modelos, enums y servicios
- `ui/`: Componentes presentacionales
- Componente contenedor (smart component)
- Rutas propias

### 3. Smart/Dumb Components Pattern

| Tipo | Responsabilidad | Ejemplo |
|------|-----------------|---------|
| **Smart** | Orquestar flujo, manejar estado, llamar servicios | `ValidationComponent` |
| **Dumb** | Recibir inputs, emitir outputs, sin lógica de negocio | `FileUploadComponent`, `ValidationFormComponent` |

### 4. Signal-Based Reactivity
Uso de Angular Signals para estado reactivo:
```typescript
documentType = signal<DocumentType>(DocumentType.INVOICE);
xml = signal<string>('');
loading = signal<boolean>(false);
```

### 5. Dependency Injection Moderna
Uso de `inject()` en lugar de constructor injection:
```typescript
private service = inject(XmlValidationService);
private destroyRef = inject(DestroyRef);
```

---

## Flujo de Datos

```
Usuario sube XML
       ↓
FileUploadComponent (dumb)
       ↓
ValidationComponent (smart) - maneja estado
       ↓
XmlValidationService - HTTP request
       ↓
API Backend (localhost:8080)
       ↓
Respuesta → agrupación de errores → UI
```

---

## Enums Principales

### DocumentType
```typescript
enum DocumentType {
  INVOICE = 'INVOICE',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  DOCUMENTO_SOPORTE = 'DOCUMENTO_SOPORTE',
}
```

### ErrorStatus
```typescript
enum ErrorStatus {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}
```

### ValidationErrorType
```typescript
enum ValidationErrorType {
  XSD = 'XSD',
  SEMANTIC = 'SEMANTIC',
  SIGNATURE = 'SIGNATURE',
}
```

---

## Servicios

### XmlValidationService
```typescript
@Injectable({ providedIn: 'root' })
export class XmlValidationService {
  validateXml(request: ValidationRequest): Observable<ApiResponse<ValidationResult>>
}
```

---

## Configuración de Entornos

### environment.ts (Desarrollo)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  apiEndpoints: {
    xmlValidation: '/api/xml/validate',
  },
};
```

### environment.prod.ts (Producción)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.dian-validator.com',
  apiEndpoints: {
    xmlValidation: '/api/xml/validate',
  },
};
```

---

## Interceptores HTTP

### ErrorInterceptor
Manejo global de errores HTTP con mensajes descriptivos para el usuario.

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | kebab-case | `validation-form.component.ts` |
| Clases | PascalCase | `ValidationFormComponent` |
| Interfaces | PascalCase + suffix | `ValidationRequest` |
| Enums | PascalCase | `DocumentType` |
| Signals | camelCase | `documentType`, `isLoading` |
| Outputs | camelCase + verb | `fileSelected`, `validate` |

---

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
ng serve

# Construir para producción
ng build

# Ejecutar tests
ng test

# Linting
npm run lint:fix
```

---

## Tecnologías

- **Angular 21** - Framework principal
- **NG-ZORRO** - Componentes UI (Ant Design)
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático
- **Vitest** - Testing
- **ESLint + Prettier** - Linting y formato

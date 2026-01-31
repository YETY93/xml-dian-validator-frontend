# Theme System Refactor - Implementation Plan

## Arquitectura Limpia de Theming

### Principio Fundamental
> **Los componentes NO deben saber si están en dark o light mode. Solo consumen tokens.**

---

## FASE 1: Eliminar lógica dark/light de componentes

### Archivos a modificar:

1. **file-upload.component.scss** - Borrar `[data-theme='dark']` block
2. **validation-form.component.scss** - Borrar `[data-theme='dark']` block  
3. **validation-results.component.scss** - Borrar `[data-theme='dark']` blocks
4. **validation.component.scss** - Verificar tokens puros

---

## FASE 2: Tokens Semánticos (styles.scss)

### Nuevos tokens a agregar:

```scss
:root {
  /* Inputs */
  --bg-input: #ffffff;
  --bg-input-hover: #f5f5f5;
  --bg-input-focus: #ffffff;
  --text-input: rgba(0, 0, 0, 0.85);
  --text-label: rgba(0, 0, 0, 0.85);
}

[data-theme='dark'] {
  --bg-input: #262626;
  --bg-input-hover: #303030;
  --bg-input-focus: #262626;
  --text-input: rgba(255, 255, 255, 0.85);
  --text-label: rgba(255, 255, 255, 0.85);
}

/* Alerts / Panels */
:root {
  --bg-panel: #ffffff;
  --bg-panel-header: #fafafa;
}

[data-theme='dark'] {
  --bg-panel: #1f1f1f;
  --bg-panel-header: #262626;
}

/* Upload */
:root {
  --border-upload: #d9d9d9;
}

[data-theme='dark'] {
  --border-upload: #434343;
}
```

---

## FASE 3: Centralizar Overrides NG-ZORRO

### Un solo bloque en styles.scss:

```scss
/* Inputs */
.ant-input, .ant-input-affix-wrapper, 
.ant-select-selector, .ant-picker {
  background-color: var(--bg-input);
  border-color: var(--border-color-secondary);
  color: var(--text-input);
  
  &:hover { border-color: var(--primary-light); }
  &:focus { border-color: var(--primary); }
}

.ant-form-item-label > label {
  color: var(--text-label);
}

/* Upload */
.ant-upload-drag {
  background-color: var(--bg-upload);
  border-color: var(--border-upload);
}

/* Alerts */
.ant-alert {
  background: var(--bg-panel);
  border-color: var(--border-color);
}
```

---

## FASE 4: Refactorizar Componentes

### Antes:
```scss
.panel-header {
  background: var(--bg-tertiary);
}
```

### Después:
```scss
.panel-header {
  background: var(--bg-panel-header);
}
```

### Tokens semánticos a usar:
- `--bg-panel` → background de cards
- `--bg-panel-header` → background de headers de secciones
- `--bg-input` → background de inputs
- `--text-label` → color de labels
- `--border-upload` → border del upload drag

---

## Checklist Final

- [ ] Ningún `[data-theme]` en componentes
- [ ] Todos los colores vienen de tokens
- [ ] Componentes completamente agnósticos
- [ ] Un solo punto de control en styles.scss
- [ ] Contraste WCAG AA en ambos temas

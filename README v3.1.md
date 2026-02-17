# Frontend V3.1 - Sistema con Control de Asistencia

Frontend actualizado con página de control de asistencia y exportación de reportes.

## 🎉 Nuevas Funcionalidades V3.1

### ✅ **Página de Control de Asistencia:**
- Selección de evento
- Lista de participantes pendientes
- Búsqueda por nombre o DPI
- Marcación individual o masiva
- Estadísticas en tiempo real
- Exportación Excel/PDF

### ✅ **Funciones de Marcación:**
- ✓ Marcar como "Asistió"
- ✗ Marcar como "No Asistió"
- Selección múltiple con checkboxes
- Actualización instantánea

### ✅ **Generación de Reportes:**
- Botón "Excel" - Descarga .xlsx
- Botón "PDF" - Descarga .pdf
- Solo incluye participantes que asistieron
- Formato profesional con datos completos

## 📦 Instalación

```bash
npm install
npm start
```

## 🎯 Nueva Página: Control de Asistencia

**Ruta:** `/asistencia`

**Funcionalidades:**

1. **Selector de Evento**
   - Lista de eventos activos
   - Carga automática de registros

2. **Estadísticas:**
   - Total Registrados
   - Asistieron (verde)
   - Pendientes (amarillo)
   - No Asistieron (rojo)
   - Porcentaje de asistencia

3. **Tabla de Pendientes:**
   - Checkbox para selección
   - Búsqueda en tiempo real
   - Botones de acción individuales
   - Seleccionar/Deseleccionar todos

4. **Acciones Masivas:**
   - Marcar múltiples como "Asistieron"
   - Marcar múltiples como "No Asistieron"
   - Contador de seleccionados

5. **Exportación:**
   - Botón Excel (verde)
   - Botón PDF (gris)
   - Descarga automática
   - Solo activos si hay asistentes

## 🔄 Flujo de Uso

### **Control de Asistencia:**

1. Login → Dashboard
2. Click en "Asistencia" en el menú
3. Seleccionar evento
4. Ver estadísticas y lista
5. **Opción A - Individual:**
   - Click "Asistió" o "No asistió" por cada uno
6. **Opción B - Masiva:**
   - Seleccionar varios con checkboxes
   - Click "Marcar Asistieron (X)"
7. Ver actualización inmediata
8. Cuando todos estén marcados:
   - Click "Excel" o "PDF"
   - Archivo se descarga automáticamente

### **Contenido del Reporte:**

**Encabezado:**
- Logo FEDECOVERA
- Título: "LISTA DE ASISTENCIA"
- Nombre del evento
- Fecha, hora y lugar
- Total de asistentes

**Tabla:**
| No. | Nombres y Apellidos | DPI | Cooperativa/Institución | Cargo/Puesto | Firma |
|-----|---------------------|-----|-------------------------|--------------|-------|
| 1   | Juan García López   | ... | Cooperativa San Marcos | Presidente   | _____ |

**Pie:**
- Fecha de generación

## 📁 Nuevos Archivos

### **Servicios:**
- `src/services/asistenciaService.js` - CRUD de asistencia y exportación

### **Páginas:**
- `src/pages/Asistencia/Asistencia.js` - Control de asistencia
- `src/pages/Asistencia/Asistencia.css` - Estilos

### **Actualizados:**
- `src/App.js` - Ruta /asistencia
- `src/components/Layout/Layout.js` - Menú "Asistencia"

## 🎨 Interfaz de Usuario

### **Estadísticas (Cards):**
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 📊 Total: 100   │ ✅ Asistieron:  │ ⏰ Pendientes:  │ ❌ No Asist.: 5 │
│                 │      85         │      10         │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### **Barra de Acciones:**
```
┌────────────────────────────────────────────────────────────────────────┐
│ 🔍 [Buscar por nombre o DPI...]    [✓ Marcar X] [✗ Marcar X] [📄][📊] │
└────────────────────────────────────────────────────────────────────────┘
```

### **Tabla:**
```
☑ | Nombre             | DPI  | Cooperativa    | Puesto     | Acciones
──┼────────────────────┼──────┼────────────────┼────────────┼──────────────
☑ | Juan García        | 1234 | Coop. A        | Presidente | [✓] [✗]
☐ | María López        | 5678 | Inst. Externa  | Directora  | [✓] [✗]
```

## 🔧 Servicios de Asistencia

```javascript
// Marcar individual
await asistenciaService.marcarAsistencia(idRegistro, 'asistio', 'notas');

// Marcar masiva
await asistenciaService.marcarAsistenciaMasiva([1,2,3], 'asistio');

// Obtener lista
await asistenciaService.getAsistenciaEvento(idEvento);

// Descargar Excel
await asistenciaService.descargarExcel(idEvento);

// Descargar PDF
await asistenciaService.descargarPDF(idEvento);
```

## 📊 Estados de Asistencia

- **registrado** (amarillo) - Inscrito pero no se ha marcado asistencia
- **asistio** (verde) - Confirmó asistencia al evento
- **no_asistio** (rojo) - No asistió al evento

## 💡 Características Especiales

- ✅ Búsqueda en tiempo real
- ✅ Selección múltiple con checkboxes
- ✅ Actualización instantánea sin recargar
- ✅ Estadísticas dinámicas
- ✅ Exportación directa a Excel/PDF
- ✅ Validación de archivos vacíos
- ✅ Mensajes de confirmación
- ✅ Diseño responsive

## 🆕 Versión 3.1.0

- Página de control de asistencia
- Marcación individual y masiva
- Exportación Excel/PDF
- Búsqueda y filtros
- Estadísticas en tiempo real

---

Desarrollado para FEDECOVERA

# Frontend V3 - Sistema de Inscripción a Asambleas

Frontend actualizado con nueva lógica de registro interno/externo para FEDECOVERA.

## 🎉 Cambios V2 → V3

### ✅ **Nueva Lógica de Registro:**
- Toggle entre Registro Interno (Cooperativa) y Externo (Institución)
- Formulario dinámico según tipo seleccionado
- Validación inteligente por combinación completa
- Soporte para múltiples registros de una misma persona

### ✅ **Vista de Inscripciones Mejorada:**
- Tabs separados para Internos y Externos
- Estadísticas por tipo
- Tabla con información completa (cooperativa, comisión, puesto)

## 📦 Instalación

```bash
npm install
npm start
```

## 🎯 Nuevas Características

### **Registro Público (/registro/:link):**

1. **Selector de Tipo:**
   - Botones para elegir: Cooperativa o Externo
   - Formulario cambia dinámicamente

2. **Registro Interno (Cooperativa):**
   - Datos personales
   - Selección de cooperativa (catálogo)
   - Selección de comisión (catálogo)
   - Selección de puesto (catálogo)

3. **Registro Externo:**
   - Datos personales
   - Institución (texto libre)
   - Puesto (texto libre)

### **Dashboard - Inscripciones:**

1. **Tabs:**
   - Cooperativas: Muestra nombre, cooperativa, comisión, puesto
   - Externos: Muestra nombre, institución, puesto

2. **Estadísticas:**
   - Total inscritos
   - Total por cooperativas
   - Total externos

## 🔧 Servicios Nuevos

### **catalogoService.js:**
```javascript
getComisiones() // Obtener lista de comisiones
getPuestos()    // Obtener lista de puestos
```

### **registroPublicoService.js (actualizado):**
```javascript
registrarEvento(link, {
  tipo_registro: 'interno' | 'externo',
  // ... datos
})
```

## 📊 Estructura de Datos

### **Registro Interno:**
```javascript
{
  tipo_registro: 'interno',
  nombres: 'Juan',
  apellidos: 'García',
  dpi: 1234567890123,
  email: 'juan@email.com',
  telefono: '12345678',
  id_cooperativa: 1,
  id_comision: 1,
  id_puesto: 1
}
```

### **Registro Externo:**
```javascript
{
  tipo_registro: 'externo',
  nombres: 'María',
  apellidos: 'Pérez',
  dpi: 9876543210987,
  email: 'maria@email.com',
  telefono: '87654321',
  institucion: 'Ministerio',
  puesto: 'Directora'
}
```

## 🎨 Componentes Actualizados

1. **RegistroPublico.js:**
   - Toggle tipo de registro
   - Formularios condicionales
   - Carga de catálogos

2. **Inscripciones.js:**
   - Sistema de tabs
   - Tablas separadas por tipo
   - Estadísticas mejoradas

## 🚀 Flujo de Usuario

### **Participante:**
1. Recibe link del evento
2. Abre formulario
3. **Selecciona tipo:** Cooperativa o Externo
4. Llena datos personales
5. Llena datos específicos del tipo
6. Se registra

### **Administrador:**
1. Ve inscripciones por evento
2. Navega entre tabs: Cooperativas / Externos
3. Ve estadísticas
4. Puede cancelar inscripciones

## 📝 Notas Importantes

- Una persona (DPI) puede tener múltiples registros internos
- Una persona puede tener múltiples registros externos
- No se permiten duplicados de la misma combinación exacta
- Los catálogos se cargan automáticamente del backend

## 🆕 Versión 3.0.0

- Sistema de tabs para inscritos
- Registro interno/externo
- Catálogos dinámicos
- Validación mejorada
- UI actualizada con colores FEDECOVERA

---

Desarrollado para FEDECOVERA

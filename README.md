# Sistema de Inscripción a Eventos - Frontend

Frontend desarrollado en React para el sistema de inscripción de personas a eventos de FEDECOVERA.

## 🎨 Características

- ✅ Interfaz minimalista con colores corporativos de FEDECOVERA
- ✅ Diseño responsivo
- ✅ Gestión completa de Cooperativas, Eventos, Personas e Inscripciones
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Búsqueda y filtrado de datos
- ✅ Modales para crear y editar registros
- ✅ Validación de formularios

## 🎨 Colores Utilizados

- **Azul Principal**: `#003B7A` (FEDECOVERA)
- **Azul Secundario**: `#0066CC`
- **Azul Claro**: `#4A90E2`
- **Blanco**: `#FFFFFF`
- **Grises**: Escala de grises para textos y fondos

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Backend API corriendo en `http://localhost:3000`

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**

El archivo `.env` ya está configurado por defecto:
```env
REACT_APP_API_URL=http://localhost:3000/api
```

Si tu backend está en otra URL, modifica este archivo.

3. **Ejecutar en desarrollo:**
```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3001`

4. **Compilar para producción:**
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
inscripcion-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Layout.js
│   │       └── Layout.css
│   ├── config/
│   │   └── api.js
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.js
│   │   │   └── Home.css
│   │   ├── Cooperativas/
│   │   │   ├── Cooperativas.js
│   │   │   └── Cooperativas.css
│   │   ├── Eventos/
│   │   │   ├── Eventos.js
│   │   │   └── Eventos.css
│   │   ├── Personas/
│   │   │   └── Personas.js
│   │   └── Inscripciones/
│   │       ├── Inscripciones.js
│   │       └── Inscripciones.css
│   ├── services/
│   │   ├── cooperativaService.js
│   │   ├── eventoService.js
│   │   ├── personaService.js
│   │   └── registroService.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Funcionalidades

### 1. Dashboard (Inicio)
- Vista general del sistema
- Accesos rápidos a todas las secciones
- Próximos eventos destacados
- Estadísticas rápidas

### 2. Gestión de Cooperativas
- Listar todas las cooperativas
- Crear nueva cooperativa
- Editar cooperativa existente
- Eliminar cooperativa
- Filtrar por estado (activa/inactiva)
- Buscar por nombre

### 3. Gestión de Eventos
- Listar todos los eventos
- Crear nuevo evento
- Editar evento existente
- Eliminar evento
- Ver inscripciones por evento
- Filtrar eventos próximos
- Buscar por nombre o lugar

### 4. Gestión de Personas
- Listar todas las personas
- Crear nueva persona
- Editar persona existente
- Eliminar persona
- Asociar a cooperativa o institución
- Buscar por nombre, apellido o DPI
- Validación de DPI único

### 5. Gestión de Inscripciones
- Listar inscripciones por evento
- Inscribir persona a evento
- Cancelar inscripción
- Ver estadísticas del evento:
  - Total de inscritos
  - Personas por cooperativa
  - Inscritos con/sin cooperativa
- Filtrar por evento

## 🎯 Flujo de Uso

### Crear un Evento e Inscribir Personas

1. **Ir a "Eventos"** → Crear nuevo evento con fecha, hora y lugar
2. **Ir a "Personas"** → Verificar que las personas estén registradas (o crear nuevas)
3. **Ir a "Inscripciones"** → Seleccionar evento e inscribir personas
4. **Ver Estadísticas** → Revisar total de inscritos y distribución

### Registrar Nueva Persona

1. **Ir a "Personas"** → Click en "Nueva Persona"
2. **Completar datos básicos**: Nombres, apellidos, DPI, etc.
3. **Seleccionar cooperativa** (si aplica) o ingresar institución
4. **Guardar**: La persona queda disponible para inscribirse a eventos

## 🌐 Navegación

El sistema cuenta con una barra de navegación fija con las siguientes secciones:

- 🏠 **Inicio**: Dashboard principal
- 🏢 **Cooperativas**: Gestión de cooperativas
- 📅 **Eventos**: Gestión de eventos
- 👥 **Personas**: Gestión de personas
- 📋 **Inscripciones**: Gestión de inscripciones

## 📱 Responsive Design

La aplicación es completamente responsiva y se adapta a:

- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (< 768px)

## 🎨 Componentes Reutilizables

### Botones
```jsx
<button className="btn btn-primary">Primario</button>
<button className="btn btn-secondary">Secundario</button>
<button className="btn btn-success">Éxito</button>
<button className="btn btn-danger">Peligro</button>
<button className="btn btn-sm">Pequeño</button>
```

### Badges
```jsx
<span className="badge badge-success">Activo</span>
<span className="badge badge-error">Inactivo</span>
<span className="badge badge-warning">Pendiente</span>
<span className="badge badge-info">Info</span>
```

### Alertas
```jsx
<div className="alert alert-success">Operación exitosa</div>
<div className="alert alert-error">Error al procesar</div>
<div className="alert alert-warning">Advertencia</div>
<div className="alert alert-info">Información</div>
```

## 🔄 Integración con Backend

El frontend se comunica con el backend a través de servicios (ubicados en `/src/services/`).

Cada servicio corresponde a un endpoint del backend:

- `cooperativaService.js` → `/api/cooperativas`
- `eventoService.js` → `/api/eventos`
- `personaService.js` → `/api/personas`
- `registroService.js` → `/api/registros`

## 🐛 Solución de Problemas

### Error de conexión con el backend

1. Verificar que el backend esté corriendo en `http://localhost:3000`
2. Revisar que la variable `REACT_APP_API_URL` en `.env` sea correcta
3. Verificar que CORS esté habilitado en el backend

### La aplicación no se actualiza

1. Detener el servidor (`Ctrl + C`)
2. Limpiar caché: `npm start`
3. Si persiste, eliminar `node_modules` y `package-lock.json`, luego `npm install`

### Errores de compilación

1. Verificar versión de Node.js: `node --version` (debe ser v14+)
2. Reinstalar dependencias: `npm install`

## 📝 Notas Importantes

- **DPI único**: El sistema valida que no existan dos personas con el mismo DPI
- **Evento activo**: Solo se pueden crear inscripciones en eventos activos
- **No duplicados**: No se permite inscribir la misma persona dos veces al mismo evento
- **Relación cooperativa/institución**: Una persona debe tener cooperativa O institución, no ambas

## 🤝 Contribuir

Para contribuir al proyecto:

1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto es propiedad de FEDECOVERA.

---

Desarrollado con ❤️ para FEDECOVERA

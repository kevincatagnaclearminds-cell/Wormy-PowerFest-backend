# 📡 Especificaciones para el Backend - Wormy PowerFest

## 🎯 Resumen Ejecutivo

El frontend está **100% completo** y listo para conectarse. Necesitamos que el backend implemente los siguientes endpoints según las especificaciones.

---

## 🔗 Configuración de Conexión

### URL Base del Backend
```
http://localhost:3003/api
```

### CORS
Debe permitir requests desde:
```javascript
origin: 'http://localhost:5173'
```

---

## 📡 Endpoints Requeridos

### 1. POST `/api/registrations` - Crear Registro

**Request Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "0990900990",
  "email": "juan@ejemplo.com",
  "sports": ["Correr", "Gimnasio"]
}
```

**Validaciones requeridas:**
- `firstName`: String, 2-50 caracteres, solo letras
- `lastName`: String, 2-50 caracteres, solo letras
- `phone`: String, exactamente 10 dígitos, debe empezar con "09"
- `email`: String, formato email válido
- `sports`: Array de strings, al menos 1 elemento, valores válidos: "Correr", "Nadar", "Gimnasio", "Ninguno"

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "0990900990",
    "email": "juan@ejemplo.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "PENDING",
    "checkInTime": null,
    "registrationDate": "2024-02-14T10:30:00.000Z",
    "createdAt": "2024-02-14T10:30:00.000Z",
    "updatedAt": "2024-02-14T10:30:00.000Z"
  }
}
```

**Errores posibles:**
```json
// 400 - Validación fallida
{
  "success": false,
  "error": "El teléfono debe tener 10 dígitos y empezar con 09"
}

// 409 - Email duplicado
{
  "success": false,
  "error": "Este email ya está registrado"
}
```

**Acciones adicionales:**
- Generar ID único (CUID)
- Guardar en base de datos
- **IMPORTANTE:** Enviar QR por email y WhatsApp (simulado por ahora)

---

### 2. GET `/api/registrations` - Listar Registros

**Query Parameters (opcionales):**
```
?status=PENDING
?limit=50
?offset=0
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456789",
      "firstName": "Juan",
      "lastName": "Pérez",
      "phone": "0990900990",
      "email": "juan@ejemplo.com",
      "sports": ["Correr", "Gimnasio"],
      "status": "PENDING",
      "checkInTime": null,
      "registrationDate": "2024-02-14T10:30:00.000Z",
      "createdAt": "2024-02-14T10:30:00.000Z",
      "updatedAt": "2024-02-14T10:30:00.000Z"
    }
  ],
  "total": 150
}
```

---

### 3. GET `/api/registrations/:id` - Obtener por ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "0990900990",
    "email": "juan@ejemplo.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "PENDING",
    "checkInTime": null,
    "registrationDate": "2024-02-14T10:30:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Registro no encontrado"
}
```

---

### 4. POST `/api/verify` - Verificar Ticket (Check-in)

**Request Body:**
```json
{
  "ticketId": "clxxx123456789"
}
```

**Response - Primera vez (200 OK):**
```json
{
  "success": true,
  "status": "success",
  "message": "Check-in exitoso",
  "data": {
    "id": "clxxx123456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "0990900990",
    "email": "juan@ejemplo.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "CHECKED_IN",
    "checkInTime": "2024-02-15T09:15:00.000Z",
    "registrationDate": "2024-02-14T10:30:00.000Z"
  }
}
```

**Response - Ya usado (200 OK):**
```json
{
  "success": true,
  "status": "already_used",
  "message": "Este ticket ya fue usado",
  "data": {
    "id": "clxxx123456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "checkInTime": "2024-02-15T09:15:00.000Z",
    "status": "CHECKED_IN"
  }
}
```

**Response - No encontrado (404):**
```json
{
  "success": false,
  "status": "not_found",
  "message": "Ticket no encontrado"
}
```

**Lógica requerida:**
1. Buscar registro por ID
2. Si no existe → `not_found`
3. Si status es `CHECKED_IN` → `already_used`
4. Si status es `PENDING`:
   - Actualizar status a `CHECKED_IN`
   - Guardar `checkInTime` con fecha/hora actual
   - Retornar `success`

---

### 5. GET `/api/stats` - Obtener Estadísticas

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "checkedIn": 87,
    "pending": 58,
    "noShow": 5,
    "sportsCount": 142,
    "sportBreakdown": {
      "Correr": 65,
      "Nadar": 42,
      "Gimnasio": 78,
      "Ninguno": 8
    },
    "recentScans": [
      {
        "id": "clxxx123456789",
        "firstName": "Juan",
        "lastName": "Pérez",
        "checkInTime": "2024-02-15T09:15:00.000Z",
        "sports": ["Correr", "Gimnasio"]
      }
    ]
  }
}
```

**Cálculos requeridos:**
- `total`: COUNT(*) de todos los registros
- `checkedIn`: COUNT(*) WHERE status = 'CHECKED_IN'
- `pending`: COUNT(*) WHERE status = 'PENDING'
- `noShow`: COUNT(*) WHERE status = 'NO_SHOW'
- `sportsCount`: COUNT(*) WHERE sports no incluye "Ninguno" y length > 0
- `sportBreakdown`: Contar cuántas veces aparece cada deporte
- `recentScans`: Últimos 10 registros con checkInTime, ordenados DESC

---

### 6. PATCH `/api/registrations/:id` - Actualizar Datos (NUEVO)

**Request Body:**
```json
{
  "email": "nuevo@ejemplo.com",
  "phone": "0991234567"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "0991234567",
    "email": "nuevo@ejemplo.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "PENDING",
    "updatedAt": "2024-02-15T10:00:00.000Z"
  }
}
```

**Validaciones:**
- Solo permitir actualizar `email` y `phone`
- Validar formato de teléfono (10 dígitos, empieza con 09)
- Validar formato de email

**Acciones adicionales:**
- Actualizar registro en base de datos
- **IMPORTANTE:** Reenviar QR por email y WhatsApp con los nuevos datos

---

## 🗄️ Esquema de Base de Datos

### Tabla: `Registration`

```sql
CREATE TABLE "Registration" (
  "id" TEXT PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "sports" TEXT[] NOT NULL,
  "status" "Status" DEFAULT 'PENDING' NOT NULL,
  "checkInTime" TIMESTAMP,
  "registrationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

CREATE TYPE "Status" AS ENUM ('PENDING', 'CHECKED_IN', 'NO_SHOW');

CREATE INDEX "idx_registration_email" ON "Registration"("email");
CREATE INDEX "idx_registration_status" ON "Registration"("status");
```

---

## ✅ Validaciones del Backend

### Teléfono Ecuatoriano
```regex
/^09\d{8}$/
```
- Exactamente 10 dígitos
- Empieza con "09"
- Solo números

### Email
```regex
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Nombres
```regex
/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/
```
- Solo letras (incluye tildes y ñ)
- Espacios permitidos
- 2-50 caracteres

### Deportes
```javascript
const validSports = ['Correr', 'Nadar', 'Gimnasio', 'Ninguno'];
// Debe ser array con al menos 1 elemento
// Todos los elementos deben estar en validSports
```

---

## 📧 Envío de Notificaciones (Simulado)

### Cuándo enviar:
1. **Al crear registro** (POST /api/registrations)
2. **Al actualizar datos** (PATCH /api/registrations/:id)

### Qué enviar:
- **Email:** QR code como imagen adjunta + datos del registro
- **WhatsApp:** Mensaje con link al QR o imagen del QR

### Datos a incluir:
```javascript
{
  id: "clxxx123456789",
  firstName: "Juan",
  lastName: "Pérez",
  phone: "0990900990",
  email: "juan@ejemplo.com",
  sports: ["Correr", "Gimnasio"],
  qrCodeUrl: "https://..." // URL del QR generado
}
```

**Por ahora:** Simular el envío (console.log) y retornar success

---

## 🔐 Headers Requeridos

### Request Headers
```
Content-Type: application/json
```

### Response Headers
```
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 🧪 Casos de Prueba

### Test 1: Crear registro válido
```bash
curl -X POST http://localhost:3003/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "0990900990",
    "email": "juan@test.com",
    "sports": ["Correr", "Gimnasio"]
  }'
```

**Esperado:** 201 Created con datos del registro

### Test 2: Teléfono inválido
```bash
curl -X POST http://localhost:3003/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "1990900990",
    "email": "juan@test.com",
    "sports": ["Correr"]
  }'
```

**Esperado:** 400 Bad Request con mensaje de error

### Test 3: Verificar ticket (primera vez)
```bash
curl -X POST http://localhost:3003/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "clxxx123456789"
  }'
```

**Esperado:** 200 OK con status "success"

### Test 4: Verificar ticket (segunda vez)
```bash
# Mismo request que Test 3
```

**Esperado:** 200 OK con status "already_used"

### Test 5: Obtener estadísticas
```bash
curl http://localhost:3003/api/stats
```

**Esperado:** 200 OK con todas las estadísticas

### Test 6: Actualizar datos
```bash
curl -X PATCH http://localhost:3003/api/registrations/clxxx123456789 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@test.com",
    "phone": "0991234567"
  }'
```

**Esperado:** 200 OK con datos actualizados

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP
- `200` - OK (éxito)
- `201` - Created (registro creado)
- `400` - Bad Request (validación fallida)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (email duplicado)
- `500` - Internal Server Error (error del servidor)

### Formato de Error
```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

---

## 📊 Prioridades de Implementación

### Fase 1 (Crítico) ✅
1. POST /api/registrations
2. GET /api/registrations
3. POST /api/verify
4. GET /api/stats

### Fase 2 (Importante) ⭐
5. PATCH /api/registrations/:id
6. GET /api/registrations/:id

### Fase 3 (Opcional) 💡
7. Envío real de emails (SendGrid/Resend)
8. Envío real de WhatsApp (Twilio)
9. Autenticación para admin

---

## 🔄 Flujo de Datos

### Registro Completo
```
Frontend envía POST /api/registrations
    ↓
Backend valida datos
    ↓
Backend genera ID único (CUID)
    ↓
Backend guarda en DB con status PENDING
    ↓
Backend simula envío de QR
    ↓
Backend retorna 201 con datos completos
    ↓
Frontend muestra ticket con QR
```

### Verificación de Ticket
```
Frontend envía POST /api/verify con ticketId
    ↓
Backend busca registro por ID
    ↓
Backend verifica status:
  - No existe → 404 not_found
  - CHECKED_IN → 200 already_used
  - PENDING → Actualiza a CHECKED_IN, guarda checkInTime
    ↓
Backend retorna resultado
    ↓
Frontend muestra mensaje correspondiente
```

### Actualización de Datos
```
Frontend envía PATCH /api/registrations/:id
    ↓
Backend valida nuevos datos
    ↓
Backend actualiza email y/o phone
    ↓
Backend simula reenvío de QR
    ↓
Backend retorna 200 con datos actualizados
    ↓
Frontend muestra confirmación
```

---

## 📝 Notas Importantes

1. **IDs únicos:** Usar CUID (librería `cuid` o Prisma lo genera automático)
2. **Timestamps:** Formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
3. **Arrays:** PostgreSQL soporta arrays nativamente
4. **Status Enum:** Solo 3 valores: PENDING, CHECKED_IN, NO_SHOW
5. **Teléfono:** Guardar como string, no como número
6. **Email:** Guardar en minúsculas para evitar duplicados

---

## 🎯 Checklist para el Backend

- [ ] Configurar CORS para localhost:5173
- [ ] Crear tabla Registration en Neon
- [ ] Implementar POST /api/registrations con validaciones
- [ ] Implementar GET /api/registrations con filtros
- [ ] Implementar POST /api/verify con lógica de check-in
- [ ] Implementar GET /api/stats con cálculos
- [ ] Implementar PATCH /api/registrations/:id
- [ ] Implementar GET /api/registrations/:id
- [ ] Probar todos los endpoints con curl/Postman
- [ ] Verificar formato de respuestas
- [ ] Manejar errores correctamente

---

## 📞 Contacto

Si tienes dudas sobre algún endpoint o necesitas aclaraciones, pregunta específicamente sobre:
- Formato de request/response
- Validaciones
- Lógica de negocio
- Casos edge

**El frontend está listo y esperando! 🚀**

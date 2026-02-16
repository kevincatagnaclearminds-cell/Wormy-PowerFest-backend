# API Backend - Sistema de Escaneo QR

## Descripción General
Este documento describe los endpoints necesarios para la aplicación móvil de escaneo QR. El backend debe manejar tres modos de operación: Control de Entrada, Entrega de Pasaporte y Pasaporte Completo.

---

## Base URL
```
https://api.tuevento.com/api
```

---

## Endpoints Requeridos

### 1. Validar QR
Valida si un código QR es válido y retorna la información del participante.

**Endpoint:** `POST /scan/validate`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}" // Opcional si requieres autenticación
}
```

**Request Body:**
```json
{
  "qr_code": "ABC123XYZ789",
  "mode": "entrada" // "entrada" | "entrega" | "completo"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "participant_id": "12345",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "registration_date": "2026-02-10T10:30:00Z",
    "status": {
      "entrada": true,
      "entrega": false,
      "completo": false
    },
    "can_scan": true,
    "message": "Participante válido"
  }
}
```

**Response Error (400/404):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QR",
    "message": "Código QR no válido o ya utilizado"
  }
}
```

---

### 2. Registrar Entrada
Registra la entrada de un participante al evento.

**Endpoint:** `POST /scan/entrada`

**Request Body:**
```json
{
  "qr_code": "ABC123XYZ789",
  "scanned_at": "2026-02-14T15:30:00Z",
  "device_id": "device-uuid-123" // Opcional para tracking
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-67890",
    "participant_id": "12345",
    "name": "Juan Pérez",
    "mode": "entrada",
    "timestamp": "2026-02-14T15:30:00Z",
    "message": "Entrada registrada exitosamente"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_ENTERED",
    "message": "El participante ya registró su entrada"
  }
}
```

---

### 3. Registrar Entrega de Pasaporte
Registra la entrega del pasaporte al participante.

**Endpoint:** `POST /scan/entrega`

**Request Body:**
```json
{
  "qr_code": "ABC123XYZ789",
  "scanned_at": "2026-02-14T16:00:00Z",
  "device_id": "device-uuid-123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-67891",
    "participant_id": "12345",
    "name": "Juan Pérez",
    "mode": "entrega",
    "timestamp": "2026-02-14T16:00:00Z",
    "message": "Entrega de pasaporte registrada"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_ENTERED",
    "message": "El participante debe registrar entrada primero"
  }
}
```

---

### 4. Registrar Pasaporte Completo
Marca el pasaporte como completo (todas las actividades realizadas).

**Endpoint:** `POST /scan/completo`

**Request Body:**
```json
{
  "qr_code": "ABC123XYZ789",
  "scanned_at": "2026-02-14T18:00:00Z",
  "device_id": "device-uuid-123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-67892",
    "participant_id": "12345",
    "name": "Juan Pérez",
    "mode": "completo",
    "timestamp": "2026-02-14T18:00:00Z",
    "message": "Pasaporte completado exitosamente"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "PASSPORT_NOT_DELIVERED",
    "message": "El pasaporte debe ser entregado primero"
  }
}
```

---

### 5. Obtener Historial de Escaneos (Opcional)
Obtiene el historial de escaneos del día actual.

**Endpoint:** `GET /scan/history`

**Query Parameters:**
```
?date=2026-02-14&mode=entrada&limit=50
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "scans": [
      {
        "scan_id": "scan-67890",
        "participant_id": "12345",
        "name": "Juan Pérez",
        "mode": "entrada",
        "timestamp": "2026-02-14T15:30:00Z",
        "status": "valid"
      },
      {
        "scan_id": "scan-67891",
        "participant_id": "12346",
        "name": "María García",
        "mode": "entrada",
        "timestamp": "2026-02-14T15:31:00Z",
        "status": "valid"
      }
    ]
  }
}
```

---

### 6. Estadísticas del Día (Opcional)
Obtiene estadísticas de escaneos del día.

**Endpoint:** `GET /scan/stats`

**Query Parameters:**
```
?date=2026-02-14
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "date": "2026-02-14",
    "total_scans": 450,
    "by_mode": {
      "entrada": 200,
      "entrega": 150,
      "completo": 100
    },
    "valid_scans": 440,
    "invalid_scans": 10,
    "last_updated": "2026-02-14T18:30:00Z"
  }
}
```

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| `INVALID_QR` | Código QR no válido o no existe |
| `ALREADY_SCANNED` | El QR ya fue escaneado en este modo |
| `ALREADY_ENTERED` | Ya se registró la entrada |
| `NOT_ENTERED` | Debe registrar entrada primero |
| `PASSPORT_NOT_DELIVERED` | El pasaporte no ha sido entregado |
| `EXPIRED_QR` | El código QR ha expirado |
| `INVALID_MODE` | Modo de escaneo no válido |
| `SERVER_ERROR` | Error interno del servidor |
| `UNAUTHORIZED` | Token de autenticación inválido |

---

## Notas de Implementación

### Seguridad
- Todos los endpoints deben usar HTTPS
- Implementar rate limiting (ej: 100 requests por minuto)
- Validar que el QR no sea reutilizado maliciosamente
- Considerar tokens de autenticación para la app

### Performance
- Los endpoints deben responder en menos de 500ms
- Implementar caché para validaciones frecuentes
- Usar índices en la base de datos para búsquedas rápidas

### Validaciones
- Validar que el modo de escaneo sea correcto
- Verificar el orden lógico: entrada → entrega → completo
- Prevenir escaneos duplicados en corto tiempo (ej: 30 segundos)

### Logs
- Registrar todos los intentos de escaneo (exitosos y fallidos)
- Guardar información del dispositivo para auditoría
- Timestamp preciso de cada operación

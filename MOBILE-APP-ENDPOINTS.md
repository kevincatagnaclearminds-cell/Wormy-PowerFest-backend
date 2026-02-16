# 📱 Endpoints para App Móvil - Wormy PowerFest

## ✅ Backend Funcionando

Base URL: `http://localhost:3003/api/scan`

---

## 📡 Endpoints Implementados

### 1. Validar QR
Valida si un código QR es válido y retorna información del participante.

**Endpoint:** `POST /api/scan/validate`

**Request Body:**
```json
{
  "qr_code": "clxxx123456789",
  "mode": "entrada"
}
```

**Modos válidos:** `"entrada"` | `"entrega"` | `"completo"`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "participant_id": "clxxx123456789",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "registration_date": "2026-02-10T10:30:00.000Z",
    "status": {
      "entrada": false,
      "entrega": false,
      "completo": false
    },
    "can_scan": true,
    "message": "Puede registrar entrada"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QR",
    "message": "Código QR no válido o no existe"
  }
}
```

---

### 2. Registrar Entrada
Registra la entrada del participante al evento.

**Endpoint:** `POST /api/scan/entrada`

**Request Body:**
```json
{
  "qr_code": "clxxx123456789",
  "scanned_at": "2026-02-14T15:30:00Z",
  "device_id": "device-uuid-123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-1707932400000",
    "participant_id": "clxxx123456789",
    "name": "Juan Pérez",
    "mode": "entrada",
    "timestamp": "2026-02-14T15:30:00.000Z",
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

**Endpoint:** `POST /api/scan/entrega`

**Request Body:**
```json
{
  "qr_code": "clxxx123456789",
  "scanned_at": "2026-02-14T16:00:00Z",
  "device_id": "device-uuid-123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-1707934800000",
    "participant_id": "clxxx123456789",
    "name": "Juan Pérez",
    "mode": "entrega",
    "timestamp": "2026-02-14T16:00:00.000Z",
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
Marca el pasaporte como completo.

**Endpoint:** `POST /api/scan/completo`

**Request Body:**
```json
{
  "qr_code": "clxxx123456789",
  "scanned_at": "2026-02-14T18:00:00Z",
  "device_id": "device-uuid-123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-1707942000000",
    "participant_id": "clxxx123456789",
    "name": "Juan Pérez",
    "mode": "completo",
    "timestamp": "2026-02-14T18:00:00.000Z",
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

### 5. Obtener Historial de Escaneos
Obtiene el historial de escaneos.

**Endpoint:** `GET /api/scan/history`

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
        "scan_id": "scan-clxxx123456789",
        "participant_id": "clxxx123456789",
        "name": "Juan Pérez",
        "mode": "entrada",
        "timestamp": "2026-02-14T15:30:00.000Z",
        "status": "valid"
      }
    ]
  }
}
```

---

### 6. Obtener Estadísticas
Obtiene estadísticas de escaneos.

**Endpoint:** `GET /api/scan/stats`

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
    "valid_scans": 450,
    "invalid_scans": 0,
    "last_updated": "2026-02-14T18:30:00.000Z"
  }
}
```

---

## 🔄 Flujo de Escaneo

```
1. ENTRADA → Participante entra al evento
   ↓
2. ENTREGA → Se le entrega el pasaporte
   ↓
3. COMPLETO → Completa todas las actividades
```

**Reglas:**
- No se puede hacer ENTREGA sin ENTRADA
- No se puede hacer COMPLETO sin ENTREGA
- Cada escaneo solo se puede hacer una vez

---

## 📋 Códigos de Error

| Código | Descripción |
|--------|-------------|
| `INVALID_QR` | Código QR no válido o no existe |
| `ALREADY_SCANNED` | El QR ya fue escaneado en este modo |
| `ALREADY_ENTERED` | Ya se registró la entrada |
| `NOT_ENTERED` | Debe registrar entrada primero |
| `PASSPORT_NOT_DELIVERED` | El pasaporte no ha sido entregado |
| `INVALID_MODE` | Modo de escaneo no válido |
| `SERVER_ERROR` | Error interno del servidor |

---

## 🧪 Testing con cURL

### Validar QR
```bash
curl -X POST http://localhost:3003/api/scan/validate \
  -H "Content-Type: application/json" \
  -d '{"qr_code":"clxxx123456789","mode":"entrada"}'
```

### Registrar Entrada
```bash
curl -X POST http://localhost:3003/api/scan/entrada \
  -H "Content-Type: application/json" \
  -d '{"qr_code":"clxxx123456789","scanned_at":"2026-02-14T15:30:00Z"}'
```

### Registrar Entrega
```bash
curl -X POST http://localhost:3003/api/scan/entrega \
  -H "Content-Type: application/json" \
  -d '{"qr_code":"clxxx123456789","scanned_at":"2026-02-14T16:00:00Z"}'
```

### Registrar Completo
```bash
curl -X POST http://localhost:3003/api/scan/completo \
  -H "Content-Type: application/json" \
  -d '{"qr_code":"clxxx123456789","scanned_at":"2026-02-14T18:00:00Z"}'
```

### Obtener Estadísticas
```bash
curl http://localhost:3003/api/scan/stats
```

---

## 📱 Configuración en la App Móvil

En tu app móvil (React Native/Flutter), configura la base URL:

```typescript
const API_BASE_URL = 'http://localhost:3003/api/scan';
// En producción: 'https://tu-dominio.com/api/scan'
```

---

## ✅ Estado Actual

- ✅ Todos los endpoints implementados
- ✅ Validaciones de flujo (entrada → entrega → completo)
- ✅ Prevención de escaneos duplicados
- ✅ Historial y estadísticas
- ✅ Base de datos actualizada con nuevos campos
- ✅ Formato de respuesta según especificación

---

## 🎯 Resumen de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/scan/validate` | Validar QR |
| POST | `/api/scan/entrada` | Registrar entrada |
| POST | `/api/scan/entrega` | Registrar entrega pasaporte |
| POST | `/api/scan/completo` | Registrar pasaporte completo |
| GET | `/api/scan/history` | Obtener historial |
| GET | `/api/scan/stats` | Obtener estadísticas |

---

## 🚀 Listo para Usar

El backend está completamente configurado y listo para que tu app móvil consuma los endpoints de escaneo QR.

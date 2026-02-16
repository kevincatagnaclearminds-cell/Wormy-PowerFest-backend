# 🚀 Resumen Rápido para el Backend

## TL;DR

Frontend completo conectándose a: `http://localhost:3003/api`

Necesitamos **6 endpoints** funcionando.

---

## 📡 Endpoints Requeridos

### 1. POST `/api/registrations` - Crear registro
```json
// Request
{
  "firstName": "Juan",
  "lastName": "Pérez", 
  "phone": "0990900990",
  "email": "juan@test.com",
  "sports": ["Correr", "Gimnasio"]
}

// Response 201
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "0990900990",
    "email": "juan@test.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "PENDING",
    "checkInTime": null,
    "registrationDate": "2024-02-14T10:30:00.000Z",
    "createdAt": "2024-02-14T10:30:00.000Z",
    "updatedAt": "2024-02-14T10:30:00.000Z"
  }
}
```

### 2. GET `/api/registrations` - Listar todos
```json
// Response 200
{
  "success": true,
  "data": [...],
  "total": 150
}
```

### 3. GET `/api/registrations/:id` - Obtener uno
```json
// Response 200
{
  "success": true,
  "data": { ... }
}
```

### 4. POST `/api/verify` - Verificar ticket
```json
// Request
{
  "ticketId": "clxxx123"
}

// Response 200 - Primera vez
{
  "success": true,
  "status": "success",
  "message": "Check-in exitoso",
  "data": { ... }
}

// Response 200 - Ya usado
{
  "success": true,
  "status": "already_used",
  "message": "Este ticket ya fue usado",
  "data": { ... }
}

// Response 404 - No existe
{
  "success": false,
  "status": "not_found",
  "message": "Ticket no encontrado"
}
```

### 5. GET `/api/stats` - Estadísticas
```json
// Response 200
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
        "id": "clxxx123",
        "firstName": "Juan",
        "lastName": "Pérez",
        "checkInTime": "2024-02-15T09:15:00.000Z",
        "sports": ["Correr"]
      }
    ]
  }
}
```

### 6. PATCH `/api/registrations/:id` - Actualizar datos
```json
// Request
{
  "email": "nuevo@test.com",
  "phone": "0991234567"
}

// Response 200
{
  "success": true,
  "data": { ... }
}
```

---

## ✅ Validaciones Críticas

### Teléfono
- Exactamente 10 dígitos
- Empieza con "09"
- Regex: `/^09\d{8}$/`

### Email
- Formato válido
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Deportes
- Array con al menos 1 elemento
- Valores válidos: "Correr", "Nadar", "Gimnasio", "Ninguno"

---

## 🗄️ Base de Datos

```sql
CREATE TABLE "Registration" (
  "id" TEXT PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "sports" TEXT[] NOT NULL,
  "status" TEXT DEFAULT 'PENDING' NOT NULL,
  "checkInTime" TIMESTAMP,
  "registrationDate" TIMESTAMP DEFAULT NOW() NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Status: 'PENDING' | 'CHECKED_IN' | 'NO_SHOW'
```

---

## 🔧 CORS

```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 🧪 Test Rápido

```bash
# Crear registro
curl -X POST http://localhost:3003/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Juan","lastName":"Pérez","phone":"0990900990","email":"juan@test.com","sports":["Correr"]}'

# Listar
curl http://localhost:3003/api/registrations

# Stats
curl http://localhost:3003/api/stats

# Verificar
curl -X POST http://localhost:3003/api/verify \
  -H "Content-Type: application/json" \
  -d '{"ticketId":"clxxx123"}'
```

---

## 📋 Checklist

- [ ] CORS configurado
- [ ] Tabla creada en Neon
- [ ] POST /api/registrations
- [ ] GET /api/registrations
- [ ] POST /api/verify
- [ ] GET /api/stats
- [ ] PATCH /api/registrations/:id
- [ ] GET /api/registrations/:id

---

## 📚 Documentación Completa

Ver `PARA-EL-BACKEND.md` para detalles completos de cada endpoint.

**Frontend listo y esperando! 🎉**

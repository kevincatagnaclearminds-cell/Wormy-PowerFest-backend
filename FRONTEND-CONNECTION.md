# 🔗 Conexión Frontend - Backend

## ✅ Backend Funcionando

El backend está corriendo en: `http://localhost:3003`

## 📝 Configuración del Frontend

Crea un archivo `.env` en la raíz de tu proyecto frontend con:

```env
VITE_API_URL=http://localhost:3003/api
```

## 📡 Endpoints Disponibles

Todos los endpoints están implementados según la especificación:

### 1. Crear Registro
```
POST http://localhost:3003/api/registrations
```

**Body:**
```json
{
  "firstName": "Alex",
  "lastName": "Rivera",
  "phone": "+593 9 123 4567",
  "email": "alex@example.com",
  "sports": ["Correr", "Gimnasio"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "firstName": "Alex",
    "lastName": "Rivera",
    "phone": "+34 612 345 678",
    "email": "alex@example.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "PENDING",
    "checkInTime": null,
    "registrationDate": "2024-02-14T10:30:00.000Z",
    "createdAt": "2024-02-14T10:30:00.000Z",
    "updatedAt": "2024-02-14T10:30:00.000Z"
  }
}
```

### 2. Obtener Todos los Registros
```
GET http://localhost:3002/api/registrations
GET http://localhost:3002/api/registrations?status=PENDING
GET http://localhost:3002/api/registrations?limit=50&offset=0
```

**Response (200):**
```json
{
  "success": true,
  "data": [...],
  "total": 150
}
```

### 3. Obtener Registro por ID
```
GET http://localhost:3002/api/registrations/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

### 4. Verificar Ticket (Check-in)
```
POST http://localhost:3002/api/verify
```

**Body:**
```json
{
  "ticketId": "clxxx123456789"
}
```

**Response - Primera vez (200):**
```json
{
  "success": true,
  "status": "success",
  "message": "Check-in exitoso",
  "data": {
    "id": "clxxx123456789",
    "firstName": "Alex",
    "lastName": "Rivera",
    "phone": "+34 612 345 678",
    "email": "alex@example.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "CHECKED_IN",
    "checkInTime": "2024-02-15T09:15:00.000Z",
    "registrationDate": "2024-02-14T10:30:00.000Z"
  }
}
```

**Response - Ya usado (200):**
```json
{
  "success": true,
  "status": "already_used",
  "message": "Este ticket ya fue usado",
  "data": {
    "id": "clxxx123456789",
    "firstName": "Alex",
    "lastName": "Rivera",
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

### 5. Obtener Estadísticas
```
GET http://localhost:3002/api/stats
```

**Response (200):**
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
        "firstName": "Alex",
        "lastName": "Rivera",
        "checkInTime": "2024-02-15T09:15:00.000Z",
        "sports": ["Correr", "Gimnasio"]
      }
    ]
  }
}
```

## ✅ Validaciones Implementadas

- ✅ Email válido (formato correcto)
- ✅ Teléfono válido (exactamente 10 dígitos)
- ✅ Email único (no duplicados)
- ✅ Deportes válidos (Correr, Nadar, Gimnasio, Ninguno)
- ✅ Campos requeridos

## 🧪 Ejemplo de Uso en Frontend

```typescript
// Crear registro
const response = await fetch(`${import.meta.env.VITE_API_URL}/registrations`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Alex',
    lastName: 'Rivera',
    phone: '0987654321',
    email: 'alex@example.com',
    sports: ['Correr', 'Gimnasio']
  })
});

const data = await response.json();

if (data.success) {
  console.log('Registro creado:', data.data);
} else {
  console.error('Error:', data.error);
}
```

```typescript
// Verificar ticket
const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ticketId: 'clxxx123456789'
  })
});

const data = await response.json();

if (data.success && data.status === 'success') {
  console.log('Check-in exitoso:', data.data);
} else if (data.status === 'already_used') {
  console.log('Ticket ya usado');
} else {
  console.error('Ticket no encontrado');
}
```

```typescript
// Obtener estadísticas
const response = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
const data = await response.json();

if (data.success) {
  console.log('Stats:', data.data);
}
```

## 🎯 Estado Actual

- ✅ Base de datos Neon conectada
- ✅ Servidor corriendo en puerto 3002
- ✅ Todos los endpoints implementados
- ✅ Validaciones funcionando
- ✅ CORS configurado para localhost:5173
- ✅ Formato de respuesta según especificación

## 🚀 Siguiente Paso

Conecta tu frontend usando la URL: `http://localhost:3003/api`

**Formato de teléfono:** 10 dígitos exactos (ejemplo: 0987654321)

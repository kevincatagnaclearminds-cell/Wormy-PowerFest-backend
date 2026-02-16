# 📡 API Endpoints - Wormy PowerFest

Endpoints que tu backend debe implementar para que el frontend funcione correctamente.

**Base URL**: `http://localhost:3001/api`

---

## 1️⃣ Crear Registro (Registration)

### `POST /api/registrations`

Crea un nuevo registro de asistente.

#### Request Body
```json
{
  "firstName": "Alex",
  "lastName": "Rivera",
  "phone": "+34 612 345 678",
  "email": "alex.rivera@example.com",
  "sports": ["Correr", "Gimnasio"]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "firstName": "Alex",
    "lastName": "Rivera",
    "phone": "+34 612 345 678",
    "email": "alex.rivera@example.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "PENDING",
    "checkInTime": null,
    "registrationDate": "2024-02-14T10:30:00.000Z",
    "createdAt": "2024-02-14T10:30:00.000Z",
    "updatedAt": "2024-02-14T10:30:00.000Z"
  }
}
```

#### Errores Posibles
```json
// 400 Bad Request - Datos inválidos
{
  "success": false,
  "error": "Email inválido"
}

// 409 Conflict - Email ya existe
{
  "success": false,
  "error": "Este email ya está registrado"
}
```

---

## 2️⃣ Obtener Todos los Registros

### `GET /api/registrations`

Obtiene la lista completa de registros.

#### Query Parameters (Opcionales)
```
?status=PENDING          // Filtrar por estado
?limit=50                // Limitar resultados
?offset=0                // Paginación
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123456789",
      "firstName": "Alex",
      "lastName": "Rivera",
      "phone": "+34 612 345 678",
      "email": "alex.rivera@example.com",
      "sports": ["Correr", "Gimnasio"],
      "status": "PENDING",
      "checkInTime": null,
      "registrationDate": "2024-02-14T10:30:00.000Z",
      "createdAt": "2024-02-14T10:30:00.000Z",
      "updatedAt": "2024-02-14T10:30:00.000Z"
    },
    {
      "id": "clyyy987654321",
      "firstName": "Sarah",
      "lastName": "Chen",
      "phone": "+34 623 456 789",
      "email": "sarah@example.com",
      "sports": ["Nadar"],
      "status": "CHECKED_IN",
      "checkInTime": "2024-02-15T09:15:00.000Z",
      "registrationDate": "2024-02-14T11:00:00.000Z",
      "createdAt": "2024-02-14T11:00:00.000Z",
      "updatedAt": "2024-02-15T09:15:00.000Z"
    }
  ],
  "total": 2
}
```

---

## 3️⃣ Obtener Registro por ID

### `GET /api/registrations/:id`

Obtiene un registro específico por su ID.

#### URL Parameters
```
id: string (CUID del registro)
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "firstName": "Alex",
    "lastName": "Rivera",
    "phone": "+34 612 345 678",
    "email": "alex.rivera@example.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "PENDING",
    "checkInTime": null,
    "registrationDate": "2024-02-14T10:30:00.000Z",
    "createdAt": "2024-02-14T10:30:00.000Z",
    "updatedAt": "2024-02-14T10:30:00.000Z"
  }
}
```

#### Errores
```json
// 404 Not Found
{
  "success": false,
  "error": "Registro no encontrado"
}
```

---

## 4️⃣ Verificar Ticket (Check-in)

### `POST /api/verify`

Verifica un ticket y realiza el check-in si es válido.

#### Request Body
```json
{
  "ticketId": "clxxx123456789"
}
```

#### Response - Primera vez (200 OK)
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
    "email": "alex.rivera@example.com",
    "sports": ["Correr", "Gimnasio"],
    "status": "CHECKED_IN",
    "checkInTime": "2024-02-15T09:15:00.000Z",
    "registrationDate": "2024-02-14T10:30:00.000Z"
  }
}
```

#### Response - Ya usado (200 OK)
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

#### Response - No encontrado (404 Not Found)
```json
{
  "success": false,
  "status": "not_found",
  "message": "Ticket no encontrado"
}
```

---

## 5️⃣ Obtener Estadísticas

### `GET /api/stats`

Obtiene estadísticas generales del evento.

#### Response (200 OK)
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
      },
      {
        "id": "clyyy987654321",
        "firstName": "Sarah",
        "lastName": "Chen",
        "checkInTime": "2024-02-15T09:10:00.000Z",
        "sports": ["Nadar"]
      }
    ]
  }
}
```

---

## 6️⃣ Actualizar Estado (Opcional - Admin)

### `PATCH /api/registrations/:id/status`

Actualiza manualmente el estado de un registro.

#### Request Body
```json
{
  "status": "NO_SHOW"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "status": "NO_SHOW",
    "updatedAt": "2024-02-15T10:00:00.000Z"
  }
}
```

---

## 🔒 Headers Requeridos

Todos los requests deben incluir:

```
Content-Type: application/json
```

Si implementas autenticación (opcional):
```
Authorization: Bearer <token>
```

---

## 🌐 CORS Configuration

Tu backend debe permitir requests desde:

```javascript
// En tu backend (Express ejemplo)
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true
}));
```

---

## ⚡ Validaciones Requeridas

### Email
```regex
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### Teléfono
```regex
/^\+34\s?\d{3}\s?\d{3}\s?\d{3}$/
```

### Nombre/Apellido
```regex
/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/
```

### Sports
```javascript
const validSports = ['Correr', 'Nadar', 'Gimnasio', 'Ninguno'];
// Debe ser un array con al menos 1 elemento
// Todos los elementos deben estar en validSports
```

---

## 🧪 Testing con cURL

### Crear registro
```bash
curl -X POST http://localhost:3001/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alex",
    "lastName": "Rivera",
    "phone": "+34 612 345 678",
    "email": "alex@example.com",
    "sports": ["Correr", "Gimnasio"]
  }'
```

### Obtener todos los registros
```bash
curl http://localhost:3001/api/registrations
```

### Verificar ticket
```bash
curl -X POST http://localhost:3001/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "clxxx123456789"
  }'
```

### Obtener estadísticas
```bash
curl http://localhost:3001/api/stats
```

---

## 📝 Notas Importantes

1. **IDs**: Usa CUID para generar IDs únicos (librería `cuid` o Prisma lo hace automático)
2. **Timestamps**: Usa formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
3. **Status Enum**: Solo acepta: `PENDING`, `CHECKED_IN`, `NO_SHOW`
4. **Sports Array**: Puede estar vacío pero debe ser un array
5. **Error Handling**: Siempre devuelve `{ success: false, error: "mensaje" }`
6. **Status Codes**: 
   - 200: OK
   - 201: Created
   - 400: Bad Request
   - 404: Not Found
   - 409: Conflict
   - 500: Internal Server Error

---

## 🚀 Orden de Implementación Recomendado

1. ✅ `POST /api/registrations` - Crear registro
2. ✅ `GET /api/registrations` - Listar registros
3. ✅ `GET /api/registrations/:id` - Obtener por ID
4. ✅ `GET /api/stats` - Estadísticas
5. ✅ `POST /api/verify` - Verificar ticket
6. ⭐ `PATCH /api/registrations/:id/status` - Actualizar estado (opcional)

---

## 🔗 Ejemplo de Implementación (Express + Prisma)

```javascript
// POST /api/registrations
app.post('/api/registrations', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, sports } = req.body;
    
    // Validaciones
    if (!firstName || !lastName || !phone || !email || !sports) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }
    
    // Crear registro
    const registration = await prisma.registration.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        sports,
        status: 'PENDING'
      }
    });
    
    res.status(201).json({
      success: true,
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear registro'
    });
  }
});
```

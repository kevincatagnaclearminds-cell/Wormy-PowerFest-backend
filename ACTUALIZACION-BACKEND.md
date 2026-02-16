# 🔄 Actualización Importante - Editar Datos

## ⚠️ Cambio Crítico

El frontend ahora **SÍ llama al backend** cuando el usuario edita sus datos (correo y teléfono).

---

## 📡 Endpoint que DEBE funcionar

### PATCH `/api/registrations/:id`

Este endpoint es **CRÍTICO** para que la función "Editar Datos" funcione.

**URL Ejemplo:**
```
PATCH http://localhost:3003/api/registrations/clxxx123456789
```

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
    "checkInTime": null,
    "registrationDate": "2024-02-14T10:30:00.000Z",
    "createdAt": "2024-02-14T10:30:00.000Z",
    "updatedAt": "2024-02-15T10:00:00.000Z"
  }
}
```

---

## 🔧 Implementación Requerida

### 1. Validar datos
```javascript
// Validar email
if (email && !isValidEmail(email)) {
  return res.status(400).json({
    success: false,
    error: "Email inválido"
  });
}

// Validar teléfono
if (phone && !isValidPhone(phone)) {
  return res.status(400).json({
    success: false,
    error: "El teléfono debe tener 10 dígitos y empezar con 09"
  });
}
```

### 2. Actualizar en base de datos
```javascript
const updated = await prisma.registration.update({
  where: { id: req.params.id },
  data: {
    email: req.body.email,
    phone: req.body.phone,
    updatedAt: new Date()
  }
});
```

### 3. Reenviar QR (simulado)
```javascript
// Simular envío de QR por email y WhatsApp
console.log(`📧 Reenviando QR a ${updated.email}`);
console.log(`📱 Reenviando QR a ${updated.phone}`);
```

### 4. Retornar datos actualizados
```javascript
res.status(200).json({
  success: true,
  data: updated
});
```

---

## 🧪 Test del Endpoint

```bash
# Actualizar email y teléfono
curl -X PATCH http://localhost:3003/api/registrations/clxxx123456789 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@test.com",
    "phone": "0991234567"
  }'
```

**Esperado:** 200 OK con datos actualizados

---

## 🔄 Flujo Completo

```
Usuario hace clic en "Editar Datos"
    ↓
Modal se abre con datos actuales
    ↓
Usuario edita email y/o teléfono
    ↓
Usuario hace clic en "Guardar y Reenviar"
    ↓
Frontend valida datos
    ↓
Frontend llama: PATCH /api/registrations/:id  ← AQUÍ!
    ↓
Backend valida datos
    ↓
Backend actualiza en base de datos
    ↓
Backend simula reenvío de QR
    ↓
Backend retorna datos actualizados
    ↓
Frontend actualiza el ticket mostrado
    ↓
Frontend muestra: "✅ Datos actualizados"
    ↓
Cooldown de 60 segundos activado
```

---

## ⚠️ Errores Posibles

### 404 - Registro no encontrado
```json
{
  "success": false,
  "error": "Registro no encontrado"
}
```

### 400 - Validación fallida
```json
{
  "success": false,
  "error": "El teléfono debe tener 10 dígitos y empezar con 09"
}
```

### 409 - Email duplicado (opcional)
```json
{
  "success": false,
  "error": "Este email ya está registrado por otro usuario"
}
```

---

## 📝 Notas Importantes

1. **Solo actualizar email y phone**: No permitir cambiar nombre, apellido o deportes
2. **Validar formato**: Mismo formato que en POST /api/registrations
3. **updatedAt**: Actualizar timestamp automáticamente
4. **Reenvío de QR**: Por ahora simular con console.log
5. **Retornar datos completos**: Frontend necesita todos los campos

---

## ✅ Checklist

- [ ] Endpoint PATCH /api/registrations/:id implementado
- [ ] Validación de email funcionando
- [ ] Validación de teléfono funcionando
- [ ] Actualización en base de datos funcionando
- [ ] Retorna datos completos
- [ ] Maneja error 404 si no existe
- [ ] Maneja error 400 si validación falla
- [ ] Probado con curl/Postman

---

## 🚨 Prioridad

**ALTA** - El frontend ya está llamando a este endpoint. Sin él, la función "Editar Datos" no funcionará.

---

## 📞 Ejemplo Completo (Express + Prisma)

```javascript
// PATCH /api/registrations/:id
app.patch('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone } = req.body;

    // Validar email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // Validar teléfono
    if (phone && !/^09\d{8}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'El teléfono debe tener 10 dígitos y empezar con 09'
      });
    }

    // Actualizar en base de datos
    const updated = await prisma.registration.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(phone && { phone }),
        updatedAt: new Date()
      }
    });

    // Simular reenvío de QR
    console.log(`📧 QR reenviado a ${updated.email}`);
    console.log(`📱 QR reenviado a ${updated.phone}`);

    // Retornar datos actualizados
    res.status(200).json({
      success: true,
      data: updated
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Registro no encontrado'
      });
    }

    console.error('Error al actualizar registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar datos'
    });
  }
});
```

---

## 🎯 Resumen

**Frontend actualizado:** ✅ Ya llama al backend
**Backend necesita:** ⏳ Implementar PATCH /api/registrations/:id

Una vez implementado, la función "Editar Datos" guardará los cambios en la base de datos correctamente.

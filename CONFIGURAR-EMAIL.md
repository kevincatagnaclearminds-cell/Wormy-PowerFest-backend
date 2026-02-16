# 📧 Configurar Envío de QR por Email y WhatsApp

## ✅ Implementación Completada

El backend ahora envía automáticamente el QR por email y WhatsApp cuando alguien se registra.

---

## 🔧 Configuración de Gmail

### 1. Crear una App Password de Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Ve a **Seguridad**
3. Activa **Verificación en 2 pasos** (si no está activada)
4. Busca **Contraseñas de aplicaciones**
5. Selecciona **Correo** y **Otro (nombre personalizado)**
6. Escribe "Wormy PowerFest Backend"
7. Copia la contraseña de 16 caracteres que te da

### 2. Configurar el archivo `.env`

Edita `backend/.env` y agrega:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # La contraseña de app que copiaste
```

**Ejemplo:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=evento@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

---

## 📱 Cómo Funciona

### Flujo Automático:

1. **Usuario se registra en la web**
   ```
   POST /api/registrations
   ```

2. **Backend crea el registro**
   - Guarda en la base de datos
   - Genera el ID único para el QR

3. **Backend envía automáticamente:**
   - ✉️ **Email** con el QR adjunto como imagen
   - 📱 **WhatsApp** con link para abrir chat con el mensaje

4. **Usuario recibe:**
   - Email con QR en su bandeja
   - Notificación de WhatsApp (si está instalado)

---

## 🔄 Endpoint de Reenvío

Si el usuario no recibió el QR, puede reenviarlo:

**Endpoint:** `POST /api/registrations/:id/resend`

**Ejemplo:**
```bash
curl -X POST http://localhost:3003/api/registrations/clxxx123456789/resend
```

**Response:**
```json
{
  "success": true,
  "message": "QR reenviado exitosamente",
  "notifications": {
    "email": {
      "success": true,
      "message": "Email enviado exitosamente"
    },
    "whatsapp": {
      "success": true,
      "whatsappLink": "https://wa.me/593987654321?text=...",
      "message": "Link de WhatsApp generado"
    }
  }
}
```

---

## 🎨 Diseño del Email

El email incluye:
- ✅ Saludo personalizado con el nombre
- ✅ QR code como imagen adjunta
- ✅ ID del ticket
- ✅ Instrucciones importantes
- ✅ Diseño responsive y profesional

---

## 📱 Mensaje de WhatsApp

El mensaje incluye:
- ✅ Saludo personalizado
- ✅ Confirmación de registro
- ✅ ID del ticket
- ✅ Instrucciones para el evento

---

## 🌐 Implementación en el Frontend Web

### Después de crear el registro:

```typescript
const response = await fetch('http://localhost:3003/api/registrations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

const data = await response.json();

if (data.success) {
  // Mostrar mensaje de éxito
  alert(`✅ Registro exitoso!\n\n` +
        `📧 Email: ${data.notifications.email.success ? 'Enviado' : 'Error'}\n` +
        `📱 WhatsApp: ${data.notifications.whatsapp.success ? 'Enviado' : 'Error'}`);
  
  // Si WhatsApp está disponible, abrir el link
  if (data.notifications.whatsapp.whatsappLink) {
    window.open(data.notifications.whatsapp.whatsappLink, '_blank');
  }
}
```

### Botón de Reenviar:

```typescript
const resendQR = async (ticketId: string) => {
  const response = await fetch(`http://localhost:3003/api/registrations/${ticketId}/resend`, {
    method: 'POST'
  });
  
  const data = await response.json();
  
  if (data.success) {
    alert('✅ QR reenviado exitosamente!');
    
    // Abrir WhatsApp si está disponible
    if (data.notifications.whatsapp.whatsappLink) {
      window.open(data.notifications.whatsapp.whatsappLink, '_blank');
    }
  }
};
```

---

## 🧪 Probar el Envío

### 1. Crear un registro de prueba:

```bash
curl -X POST http://localhost:3003/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "tu-email@gmail.com",
    "phone": "0987654321",
    "sports": ["Correr"]
  }'
```

### 2. Verificar:
- ✅ Revisa tu bandeja de entrada
- ✅ Revisa spam/promociones
- ✅ Verifica que WhatsApp se abra (si está instalado)

### 3. Probar reenvío:

```bash
curl -X POST http://localhost:3003/api/registrations/TICKET_ID/resend
```

---

## ⚠️ Notas Importantes

### Email:
- Gmail tiene límite de 500 emails por día
- Si envías muchos, considera usar SendGrid o Mailgun
- Los emails pueden caer en spam la primera vez

### WhatsApp:
- El link abre WhatsApp Web o la app
- El usuario debe confirmar el envío del mensaje
- No es automático, requiere acción del usuario

---

## 🔒 Seguridad

- ✅ Nunca compartas tu SMTP_PASS
- ✅ Usa variables de entorno
- ✅ No subas el archivo `.env` a Git
- ✅ El `.gitignore` ya incluye `.env`

---

## 🚀 Alternativas para Producción

Si necesitas enviar muchos emails, considera:

### SendGrid (Recomendado)
- 100 emails gratis por día
- Más confiable que Gmail
- Mejor deliverability

### Mailgun
- 5,000 emails gratis por mes
- API simple

### Amazon SES
- Muy económico
- Escalable

---

## 📊 Respuesta del Backend

### Al crear registro:
```json
{
  "success": true,
  "data": {
    "id": "clxxx123456789",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "0987654321",
    ...
  },
  "notifications": {
    "email": {
      "success": true,
      "message": "Email enviado exitosamente"
    },
    "whatsapp": {
      "success": true,
      "whatsappLink": "https://wa.me/593987654321?text=...",
      "message": "Link de WhatsApp generado"
    }
  }
}
```

---

## ✅ Checklist

- [ ] Configurar Gmail App Password
- [ ] Actualizar `.env` con credenciales
- [ ] Reiniciar el backend
- [ ] Probar crear un registro
- [ ] Verificar que llegue el email
- [ ] Verificar que se abra WhatsApp
- [ ] Probar el botón de reenviar

---

¿Listo para configurar tu email? Solo necesitas:
1. Crear la App Password de Gmail
2. Actualizar el `.env`
3. Reiniciar el backend

¡Y listo! 🎉

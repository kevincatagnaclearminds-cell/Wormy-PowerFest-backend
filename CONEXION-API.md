# 🔌 Guía de Conexión con el Backend

## ✅ Configuración Completada

La app ya está configurada para conectarse con tu backend en:
```
http://192.168.100.46:3003/api/scan
```

---

## 📁 Archivos Creados

### 1. `.env`
Contiene la URL del backend:
```env
EXPO_PUBLIC_API_URL=http://192.168.100.46:3003/api/scan
```

### 2. `src/services/scanService.ts`
Servicio con todas las funciones para consumir la API:
- `validateQR()` - Validar QR antes de escanear
- `registrarEntrada()` - Registrar entrada
- `registrarEntrega()` - Registrar entrega de pasaporte
- `registrarCompleto()` - Marcar pasaporte completo
- `getHistory()` - Obtener historial
- `getStats()` - Obtener estadísticas

### 3. `src/config/api.ts`
Configuración centralizada de la API y mensajes de error.

### 4. `src/components/ScannerView.tsx` (Actualizado)
Ahora usa la API real en lugar de datos simulados.

---

## 🚀 Cómo Funciona

### Flujo de Escaneo:

1. **Usuario escanea QR** → `QRScanner` captura el código
2. **Validación** → `validateQR()` verifica si el QR es válido
3. **Confirmación** → Muestra info del participante y pide confirmación
4. **Registro** → Llama a `registrarEntrada()`, `registrarEntrega()` o `registrarCompleto()`
5. **Resultado** → Muestra mensaje de éxito o error

### Ejemplo de Flujo:

```typescript
// 1. Escanear QR
const qrCode = "ABC123XYZ789";

// 2. Validar
const validation = await validateQR(qrCode, 'entrada');
// Respuesta: { success: true, data: { name: "Juan", can_scan: true, ... } }

// 3. Si es válido, registrar
const result = await registrarEntrada(qrCode);
// Respuesta: { success: true, data: { message: "Entrada registrada", ... } }
```

---

## 🧪 Probar la Conexión

### Opción 1: Desde la App

1. Abre la app en Expo Go
2. Selecciona un modo (Entrada, Entrega o Completo)
3. Escanea un QR válido
4. Verás un alert con la información del participante

### Opción 2: Probar Manualmente

Agrega esto temporalmente en `App.tsx` para probar:

```typescript
import { useEffect } from 'react';
import { getStats } from './src/services/scanService';

// Dentro del componente App:
useEffect(() => {
  const testConnection = async () => {
    console.log('🔍 Probando conexión con backend...');
    const result = await getStats();
    
    if (result.success) {
      console.log('✅ Conexión exitosa!');
      console.log('📊 Stats:', result.data);
    } else {
      console.log('❌ Error de conexión:', result.error?.message);
    }
  };
  
  testConnection();
}, []);
```

---

## 🔧 Cambiar la IP del Backend

Si necesitas cambiar la IP del backend:

1. Edita el archivo `.env`:
```env
EXPO_PUBLIC_API_URL=http://TU_NUEVA_IP:3003/api/scan
```

2. Reinicia el servidor de Expo:
```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciar
npm start
```

---

## 📱 Requisitos para que Funcione

### En tu Computadora (Backend):
- ✅ Backend corriendo en `http://192.168.100.46:3003`
- ✅ Endpoints implementados según `API-BACKEND.md`
- ✅ Base de datos configurada según `DATABASE-SCHEMA.md`

### En tu Celular (App):
- ✅ Conectado a la misma red WiFi que tu computadora
- ✅ Expo Go instalado
- ✅ Permisos de cámara otorgados

### Red:
- ✅ Ambos dispositivos en la misma red local
- ✅ Firewall permite conexiones al puerto 3003
- ✅ No hay VPN activa que bloquee la conexión

---

## 🐛 Solución de Problemas

### Error: "No se pudo conectar con el servidor"

**Posibles causas:**

1. **Backend no está corriendo**
   - Verifica que el backend esté activo en `http://192.168.100.46:3003`
   - Prueba abrir en el navegador: `http://192.168.100.46:3003/api/scan/stats`

2. **IP incorrecta**
   - Verifica tu IP con `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
   - Actualiza el archivo `.env` si cambió

3. **Firewall bloqueando**
   - Permite conexiones entrantes al puerto 3003
   - En Windows: Panel de Control → Firewall → Permitir app

4. **Diferentes redes WiFi**
   - Asegúrate de que el celular y la PC estén en la misma red

### Error: "INVALID_QR"

- El QR no existe en la base de datos
- Verifica que el QR fue generado correctamente desde la web

### Error: "ALREADY_SCANNED"

- El participante ya escaneó en ese modo
- Esto es normal, el sistema previene escaneos duplicados

---

## 📊 Respuestas de la API

### Éxito (200):
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-123",
    "participant_id": "12345",
    "name": "Juan Pérez",
    "mode": "entrada",
    "timestamp": "2026-02-14T15:30:00Z",
    "message": "Entrada registrada exitosamente"
  }
}
```

### Error (400/404):
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

## 🎯 Próximos Pasos

1. ✅ Asegúrate de que el backend esté corriendo
2. ✅ Verifica que los endpoints estén implementados
3. ✅ Prueba escanear un QR válido
4. ✅ Revisa los logs en la consola de Expo
5. ✅ Si hay errores, verifica la red y el firewall

---

## 📞 Debugging

Para ver los logs de la app:

```bash
# En la terminal donde corre Expo
# Verás los console.log() de la app
```

Para ver requests HTTP:

```typescript
// En src/services/scanService.ts
// Ya hay console.error() para errores
// Puedes agregar console.log() para ver requests exitosos
```

---

¿Necesitas ayuda? Revisa:
- `API-BACKEND.md` - Documentación de endpoints
- `DATABASE-SCHEMA.md` - Estructura de la base de datos
- `GUIA-FRONTEND-APP.md` - Guía original de implementación

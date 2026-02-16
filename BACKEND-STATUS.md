# ✅ Backend Status - Wormy PowerFest

## Estado: FUNCIONANDO ✅

El backend está corriendo exitosamente en: `http://localhost:3001`

## 🎯 Configuración Completada

- ✅ Base de datos Neon conectada
- ✅ Migraciones aplicadas
- ✅ Servidor corriendo en puerto 3001
- ✅ Todos los endpoints disponibles

## 📡 Endpoints Disponibles

- `GET http://localhost:3001/health` - Health check
- `POST http://localhost:3001/api/registrations` - Crear registro
- `GET http://localhost:3001/api/registrations` - Obtener todos los registros
- `GET http://localhost:3001/api/registrations/:id` - Obtener registro por ID
- `POST http://localhost:3001/api/registrations/:id/check-in` - Hacer check-in
- `POST http://localhost:3001/api/verify` - Verificar ticket
- `GET http://localhost:3001/api/stats` - Obtener estadísticas

## 🔗 Para Conectar el Frontend

En tu proyecto frontend, usa esta URL en el archivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Probar el Backend

Puedes probar creando un registro:

```bash
curl -X POST http://localhost:3001/api/registrations -H "Content-Type: application/json" -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@example.com\",\"phone\":\"+34 612345678\",\"sports\":[\"Correr\",\"Gimnasio\"]}"
```

## 📊 Ver la Base de Datos

Para abrir Prisma Studio y ver los datos:

```bash
cd backend
npm run prisma:studio
```

## 🛑 Detener el Servidor

El servidor está corriendo en segundo plano. Para detenerlo, usa Ctrl+C en la terminal donde está corriendo.

## ✨ Siguiente Paso

Ahora puedes conectar tu frontend al backend usando la URL: `http://localhost:3001/api`

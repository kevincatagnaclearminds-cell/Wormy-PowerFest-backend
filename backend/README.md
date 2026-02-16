# 🚀 Wormy PowerFest Backend

Backend API para el sistema de registro del evento Wormy PowerFest.

## 📦 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Copia el archivo de ejemplo:
```bash
copy .env.example .env
```

2. Edita `.env` y agrega tu connection string de Neon:
```env
DATABASE_URL="tu-connection-string-aqui"
```

3. Ejecuta las migraciones:
```bash
npm run prisma:migrate
npm run prisma:generate
```

## 🚀 Ejecutar

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Ver base de datos
```bash
npm run prisma:studio
```

## 📡 Endpoints

- `POST /api/registrations` - Crear registro
- `GET /api/registrations` - Obtener todos los registros
- `GET /api/registrations/:id` - Obtener registro por ID
- `POST /api/registrations/:id/check-in` - Hacer check-in
- `POST /api/verify` - Verificar ticket
- `GET /api/stats` - Obtener estadísticas
- `GET /health` - Health check

## 🛠️ Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)

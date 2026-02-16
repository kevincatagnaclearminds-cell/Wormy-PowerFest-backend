# 🚀 Backend Setup - Wormy PowerFest

## Stack Tecnológico
- **Node.js + Express** - Framework del servidor
- **Prisma** - ORM para base de datos
- **Neon PostgreSQL** - Base de datos serverless
- **TypeScript** - Tipado estático

---

## 📋 Requisitos Previos
- Node.js 18+ instalado
- Cuenta en [Neon](https://neon.tech) (gratis)

---

## 🗂️ Estructura del Backend

```
backend/
├── src/
│   ├── controllers/
│   │   ├── registration.controller.ts
│   │   └── verification.controller.ts
│   ├── routes/
│   │   ├── registration.routes.ts
│   │   └── verification.routes.ts
│   ├── services/
│   │   ├── registration.service.ts
│   │   └── email.service.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🛠️ Pasos de Instalación

### 1. Crear carpeta del backend
```bash
mkdir backend
cd backend
```

### 2. Inicializar proyecto Node.js
```bash
npm init -y
```

### 3. Instalar dependencias
```bash
npm install express cors dotenv prisma @prisma/client
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
```

### 4. Configurar Neon Database

1. Ve a [https://neon.tech](https://neon.tech)
2. Crea una cuenta (gratis)
3. Crea un nuevo proyecto
4. Copia la **Connection String** (algo como: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)

### 5. Crear archivo `.env`
```env
# Database
DATABASE_URL="tu-connection-string-de-neon-aqui"

# Server
PORT=3000
NODE_ENV=development

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# Email (opcional - para enviar QR codes)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=tu-email@gmail.com
# SMTP_PASS=tu-password
```

### 6. Inicializar Prisma
```bash
npx prisma init
```

### 7. Configurar el schema de Prisma

Edita `prisma/schema.prisma` con el siguiente contenido:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Registration {
  id               String   @id @default(cuid())
  firstName        String
  lastName         String
  phone            String
  email            String
  sports           String[]
  status           Status   @default(PENDING)
  checkInTime      DateTime?
  registrationDate DateTime @default(now())
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([email])
  @@index([status])
}

enum Status {
  PENDING
  CHECKED_IN
  NO_SHOW
}
```

---

## 🗄️ Estructura de Tablas en la Base de Datos

### Tabla: `Registration`

Esta es la tabla principal que almacena todos los registros de asistentes al evento.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String (CUID) | Identificador único del registro | PRIMARY KEY, Auto-generado |
| `firstName` | String | Nombre del asistente | NOT NULL |
| `lastName` | String | Apellido del asistente | NOT NULL |
| `phone` | String | Número de teléfono | NOT NULL |
| `email` | String | Correo electrónico | NOT NULL, Indexed |
| `sports` | String[] | Array de deportes seleccionados | NOT NULL, Array |
| `status` | Enum | Estado del registro | NOT NULL, DEFAULT: PENDING |
| `checkInTime` | DateTime | Fecha/hora de check-in | NULLABLE |
| `registrationDate` | DateTime | Fecha de registro | NOT NULL, DEFAULT: now() |
| `createdAt` | DateTime | Fecha de creación del registro | NOT NULL, DEFAULT: now() |
| `updatedAt` | DateTime | Fecha de última actualización | NOT NULL, Auto-actualizado |

### Enum: `Status`

Estados posibles para un registro:

| Valor | Descripción |
|-------|-------------|
| `PENDING` | Registrado pero aún no ha hecho check-in |
| `CHECKED_IN` | Ya hizo check-in en el evento |
| `NO_SHOW` | No se presentó al evento |

### Índices

- **email**: Índice en el campo email para búsquedas rápidas
- **status**: Índice en el campo status para filtros eficientes

### Ejemplo de Datos

```json
{
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
```

### Relaciones Futuras (Opcional)

Si en el futuro quieres expandir la aplicación, podrías agregar:

```prisma
// Tabla de Deportes (si quieres normalizarla)
model Sport {
  id           String         @id @default(cuid())
  name         String         @unique
  emoji        String
  color        String
  registrations Registration[]
}

// Tabla de Eventos (para múltiples eventos)
model Event {
  id            String         @id @default(cuid())
  name          String
  date          DateTime
  location      String
  registrations Registration[]
}

// Tabla de Check-ins (historial detallado)
model CheckIn {
  id             String       @id @default(cuid())
  registrationId String
  registration   Registration @relation(fields: [registrationId], references: [id])
  checkInTime    DateTime     @default(now())
  location       String?
  verifiedBy     String?
}
```

### 8. Crear las tablas en Neon
```bash
npx prisma migrate dev --name init
```

### 9. Generar el cliente de Prisma
```bash
npx prisma generate
```

---

## 📡 API Endpoints

### Registrations

#### POST `/api/registrations`
Crear nuevo registro
```json
{
  "firstName": "Alex",
  "lastName": "Rivera",
  "phone": "+34 612 345 678",
  "email": "alex@example.com",
  "sports": ["Correr", "Gimnasio"]
}
```

#### GET `/api/registrations`
Obtener todos los registros

#### GET `/api/registrations/:id`
Obtener registro por ID

#### GET `/api/stats`
Obtener estadísticas del evento

### Verification

#### POST `/api/verify`
Verificar ticket por ID
```json
{
  "ticketId": "clxxx..."
}
```

#### POST `/api/registrations/:id/check-in`
Marcar asistencia (check-in)

---

## 🚀 Comandos para Ejecutar

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Ver base de datos (Prisma Studio)
```bash
npx prisma studio
```

---

## 🔗 Conectar con el Frontend

En tu proyecto frontend, crea un archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 📝 Notas Importantes

1. **Neon Connection String**: Asegúrate de que incluya `?sslmode=require` al final
2. **CORS**: El backend está configurado para aceptar requests desde `http://localhost:5173`
3. **Puerto**: El backend corre en el puerto 3000 por defecto
4. **Prisma Studio**: Usa `npx prisma studio` para ver y editar datos visualmente

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Verifica que tu CONNECTION_STRING de Neon sea correcta
- Asegúrate de tener conexión a internet
- Verifica que incluya `?sslmode=require`

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env` a otro (ej: 3001)
- O mata el proceso: `npx kill-port 3000`

### Error de CORS
- Verifica que `FRONTEND_URL` en `.env` coincida con tu URL de desarrollo

---

## 📦 Siguiente Paso

Una vez que tengas esto listo, te crearé todos los archivos del backend.

¿Quieres que proceda a crear todos los archivos del backend ahora?

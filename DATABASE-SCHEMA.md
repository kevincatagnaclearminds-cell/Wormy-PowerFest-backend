# 🗄️ Database Schema - Wormy PowerFest

## Resumen de Tablas

Este documento describe todas las tablas que utilizaremos en la base de datos PostgreSQL (Neon) para el sistema de registro del evento Wormy PowerFest.

---

## 📊 Tabla: `Registration`

Tabla principal que almacena todos los registros de asistentes al evento.

### Estructura

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | String (CUID) | Identificador único del registro (usado como código QR) | PRIMARY KEY, Auto-generado |
| `firstName` | String | Nombre del asistente | NOT NULL |
| `lastName` | String | Apellido del asistente | NOT NULL |
| `phone` | String | Número de teléfono (formato: +34 XXX XXX XXX) | NOT NULL |
| `email` | String | Correo electrónico | NOT NULL, Indexed |
| `sports` | String[] | Array de deportes seleccionados | NOT NULL, Array de strings |
| `status` | Enum (Status) | Estado actual del registro | NOT NULL, DEFAULT: PENDING |
| `checkInTime` | DateTime | Fecha y hora cuando hizo check-in | NULLABLE |
| `registrationDate` | DateTime | Fecha y hora de registro inicial | NOT NULL, DEFAULT: now() |
| `createdAt` | DateTime | Timestamp de creación del registro | NOT NULL, DEFAULT: now() |
| `updatedAt` | DateTime | Timestamp de última actualización | NOT NULL, Auto-actualizado |

### Índices

```sql
-- Índice en email para búsquedas rápidas por correo
CREATE INDEX idx_registration_email ON Registration(email);

-- Índice en status para filtros eficientes
CREATE INDEX idx_registration_status ON Registration(status);
```

### Valores Posibles para `sports`

- `"Correr"` 🏃
- `"Nadar"` 🏊
- `"Gimnasio"` 💪
- `"Ninguno"` ❌

### Ejemplo de Registro

```json
{
  "id": "clxxx123456789abcdef",
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
```

### Ejemplo después de Check-in

```json
{
  "id": "clxxx123456789abcdef",
  "firstName": "Alex",
  "lastName": "Rivera",
  "phone": "+34 612 345 678",
  "email": "alex.rivera@example.com",
  "sports": ["Correr", "Gimnasio"],
  "status": "CHECKED_IN",
  "checkInTime": "2024-02-15T09:15:00.000Z",
  "registrationDate": "2024-02-14T10:30:00.000Z",
  "createdAt": "2024-02-14T10:30:00.000Z",
  "updatedAt": "2024-02-15T09:15:00.000Z"
}
```

---

## 📋 Enum: `Status`

Enum que define los estados posibles de un registro.

| Valor | Descripción | Cuándo se usa |
|-------|-------------|---------------|
| `PENDING` | Pendiente de check-in | Estado inicial al registrarse |
| `CHECKED_IN` | Check-in completado | Cuando escanean el QR en el evento |
| `NO_SHOW` | No se presentó | Marcado manualmente si no llegó |

### Definición en Prisma

```prisma
enum Status {
  PENDING
  CHECKED_IN
  NO_SHOW
}
```

### Definición en SQL

```sql
CREATE TYPE "Status" AS ENUM ('PENDING', 'CHECKED_IN', 'NO_SHOW');
```

---

## 🔄 Transiciones de Estado

```
PENDING ──────────────> CHECKED_IN
   │                         │
   │                         │
   └──────> NO_SHOW <────────┘
```

### Reglas de Negocio

1. **PENDING → CHECKED_IN**: Cuando se escanea el QR por primera vez
2. **PENDING → NO_SHOW**: Marcado manualmente por admin
3. **CHECKED_IN → NO_SHOW**: No permitido (una vez dentro, no puede cambiar)
4. **NO_SHOW → CHECKED_IN**: Permitido (si llega tarde)

---

## 📈 Queries Comunes

### 1. Obtener todos los registros pendientes

```sql
SELECT * FROM "Registration" 
WHERE status = 'PENDING' 
ORDER BY "registrationDate" DESC;
```

### 2. Obtener estadísticas del evento

```sql
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'CHECKED_IN' THEN 1 END) as checked_in,
  COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'NO_SHOW' THEN 1 END) as no_show
FROM "Registration";
```

### 3. Buscar registro por email

```sql
SELECT * FROM "Registration" 
WHERE email = 'alex@example.com';
```

### 4. Obtener registros recientes con check-in

```sql
SELECT * FROM "Registration" 
WHERE status = 'CHECKED_IN' 
ORDER BY "checkInTime" DESC 
LIMIT 10;
```

### 5. Contar personas por deporte

```sql
SELECT 
  unnest(sports) as sport,
  COUNT(*) as count
FROM "Registration"
GROUP BY sport
ORDER BY count DESC;
```

---

## 🔐 Consideraciones de Seguridad

### Datos Sensibles

- **Email**: Debe ser único por registro (validar en backend)
- **Phone**: Formato validado en backend
- **ID**: Usado como código QR, debe ser único y no predecible (CUID)

### Validaciones Requeridas

```typescript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Teléfono (formato español)
const phoneRegex = /^\+34\s?\d{3}\s?\d{3}\s?\d{3}$/;

// Nombre y Apellido
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
```

---

## 📊 Estimación de Tamaño

### Por Registro

- ID: ~25 bytes
- firstName: ~20 bytes
- lastName: ~20 bytes
- phone: ~20 bytes
- email: ~30 bytes
- sports: ~50 bytes (array)
- status: ~10 bytes
- timestamps: ~24 bytes

**Total por registro**: ~200 bytes

### Capacidad

- 1,000 registros ≈ 200 KB
- 10,000 registros ≈ 2 MB
- 100,000 registros ≈ 20 MB

**Neon Free Tier**: 512 MB (suficiente para ~2.5 millones de registros)

---

## 🚀 Migraciones

### Migración Inicial

```bash
npx prisma migrate dev --name init
```

### Si necesitas agregar campos después

```bash
# Ejemplo: agregar campo 'city'
npx prisma migrate dev --name add_city_field
```

---

## 🔄 Backup y Restore

### Backup

```bash
# Desde Neon Dashboard
# Settings > Backup > Create Backup

# O usando pg_dump
pg_dump $DATABASE_URL > backup.sql
```

### Restore

```bash
psql $DATABASE_URL < backup.sql
```

---

## 📝 Schema Prisma Completo

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

## 🎯 Próximos Pasos

1. ✅ Crear cuenta en Neon
2. ✅ Copiar connection string
3. ✅ Configurar `.env` con `DATABASE_URL`
4. ✅ Ejecutar `npx prisma migrate dev --name init`
5. ✅ Verificar tablas con `npx prisma studio`

---

## 🐛 Troubleshooting

### Error: "Relation does not exist"
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Error: "Invalid connection string"
- Verifica que incluya `?sslmode=require`
- Formato: `postgresql://user:pass@host/db?sslmode=require`

### Ver estructura actual
```bash
npx prisma db pull
```

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Neon Docs](https://neon.tech/docs)
- [PostgreSQL Array Types](https://www.postgresql.org/docs/current/arrays.html)

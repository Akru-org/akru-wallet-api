# Akru Wallet API

API backend para **Akru** — billetera e inversiones. Construida con NestJS, MongoDB y arquitectura modular.

## Stack

- **Runtime:** Node.js
- **Framework:** [NestJS](https://nestjs.com) 11
- **Base de datos:** MongoDB ([Mongoose](https://mongoosejs.com))
- **Configuración:** `@nestjs/config` (variables de entorno desde `.env`)
- **Auth (opcional):** Firebase Admin (para rutas protegidas futuras)

## Estructura del proyecto

```
src/
├── common/           # BaseController, guards, interfaces
├── config/           # ConfigModule, standalone config
├── health/           # Health check (GET /)
├── users/            # Módulo de usuarios
│   ├── domain/       # Entidad, value objects, repository (interface)
│   ├── persistence/  # Schema Mongoose, mapper, UserMongoRepository
│   └── use-cases/
│       └── sync-user/
├── transactions/     # (placeholder)
├── ledger/          # (placeholder)
├── paths.ts         # Rutas de la API (definición manual)
├── app.module.ts
└── main.ts
```

## Requisitos

- Node.js 18+
- MongoDB (local o remoto)
- Cuenta Firebase (opcional, para `GOOGLE_APPLICATION_CREDENTIALS`)

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/akru-wallet` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Ruta al JSON de la **cuenta de servicio** de Firebase (necesario para `PATCH /users/me`). Mismo proyecto que el front; no usar las claves VITE_ del cliente. | `./firebase-service-account.json` |

## Ejecución

```bash
# Desarrollo (watch)
npm run start:dev

# Producción (compilar y ejecutar)
npm run build
npm run start:prod
```

La API queda disponible en `http://localhost:3000` (o el `PORT` definido).

## API

Base URL: `http://localhost:3000`

### Formato de respuesta

Todas las respuestas siguen el mismo formato:

```json
{
  "data": { ... },
  "message": "string",
  "statusCode": number
}
```

En errores, `data` es `null` y `message` contiene el mensaje de error.

---

### Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Health check. Responde "Hello World!". |

---

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/users/sync` | Registra o sincroniza un usuario por `uid` y `email`. Sin auth. |
| `PATCH` | `/users/me` | Actualiza el usuario autenticado (por ahora solo `alias`). **Requiere Bearer token (Firebase).** |

#### POST /users/sync

Crea un usuario si no existe (por `uid`); si ya existe, devuelve el usuario actual.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|------------|-------------|
| `uid` | string | Sí | Identificador del usuario (ej. Firebase UID). |
| `email` | string | Sí | Email (formato válido). |
| `alias` | string | No | Alias o nombre mostrado. |

**Ejemplo de petición:**

```bash
curl -X POST http://localhost:3000/users/sync \
  -H "Content-Type: application/json" \
  -d '{"uid":"user-123","email":"user@example.com","alias":"Mi Alias"}'
```

**Ejemplo de respuesta (200):**

```json
{
  "data": {
    "id": "uuid",
    "firebaseUid": "user-123",
    "email": "user@example.com",
    "alias": "Mi Alias",
    "kycStatus": "PENDING",
    "role": "USER",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "message": "Usuario sincronizado",
  "statusCode": 200
}
```

**Errores habituales:**

- `400`: faltan `uid` o `email`, o email inválido.
- `500`: error interno (ej. base de datos).

#### PATCH /users/me

Actualiza el alias del usuario identificado por el token de Firebase. El backend valida el token con Firebase Admin (mismo proyecto que el front); debe estar configurado `GOOGLE_APPLICATION_CREDENTIALS` con el JSON de la cuenta de servicio.

**Headers:**

| Header | Valor |
|--------|--------|
| `Authorization` | `Bearer <firebase-id-token>` |
| `Content-Type` | `application/json` |

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|------------|-------------|
| `alias` | string | No | Nuevo alias (si se omite, se mantiene el actual). |

**Ejemplo:**

```bash
curl -X PATCH http://localhost:3000/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-firebase-id-token>" \
  -d '{"alias":"Nuevo alias"}'
```

**Errores:**

- `401`: falta o token inválido/expirado.
- `404`: usuario no existe en nuestra base (debe registrarse antes con `POST /users/sync`).
- `500`: error interno.

---

## CORS

Orígenes permitidos:

- `http://localhost:8080` (desarrollo local)
- `https://akru-wallet.vercel.app` (producción)

Configuración en `src/main.ts`; se pueden añadir más orígenes al array `origin`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compila el proyecto. |
| `npm run start` | Inicia la app (sin watch). |
| `npm run start:dev` | Inicia en modo desarrollo con watch. |
| `npm run start:prod` | Ejecuta la build de producción. |
| `npm run test` | Tests unitarios. |
| `npm run lint` | Ejecuta ESLint. |

## Tests

```bash
npm run test
```

## Licencia

UNLICENSED (proyecto privado).

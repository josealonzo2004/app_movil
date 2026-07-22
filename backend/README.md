# EcoSmart Backend

API REST del proyecto EcoSmart, desarrollada con Laravel y PHP. Este backend administra usuarios, autenticacion, registros de reciclaje, puntos verdes, recompensas, canjes y funciones administrativas.

## Tecnologias

- PHP 8.3
- Laravel 13
- Laravel Sanctum
- PostgreSQL
- pgAdmin para administrar la base de datos
- API REST consumida por el frontend React Native

## Requisitos

- PHP instalado
- Composer instalado
- PostgreSQL activo
- Base de datos creada en pgAdmin

## Instalacion

Desde la carpeta `backend`:

```bash
composer install
```

Crear el archivo `.env` si no existe:

```bash
copy .env.example .env
```

Generar la llave de Laravel:

```bash
php artisan key:generate
```

## Configuracion de base de datos

En el archivo `.env`, configurar PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ecosmart
DB_USERNAME=postgres
DB_PASSWORD=tu_contrasena
```

Luego ejecutar migraciones:

```bash
php artisan migrate
```

## Ejecutar el servidor

Para que Expo Go pueda consumir la API desde el celular:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

La API quedara disponible en:

```txt
http://TU-IP-LOCAL:8000/api
```

Esa misma URL debe colocarse en el frontend, dentro de `Frontned/src/services/api.js`.

## Estructura principal

```txt
backend/
  app/
    Http/
      Controllers/
        Api/
      Middleware/
    Models/
  bootstrap/
  config/
  database/
    migrations/
  routes/
    api.php
  tests/
```

## Carpetas importantes

- `routes/api.php`: define las rutas REST de la aplicacion.
- `app/Http/Controllers/Api`: contiene la logica de cada modulo de la API.
- `app/Http/Middleware`: middleware para proteger rutas, incluyendo acceso admin.
- `app/Models`: modelos Eloquent de usuarios, reciclaje, centros, recompensas y canjes.
- `database/migrations`: estructura de tablas de la base de datos.
- `config`: configuraciones generales de Laravel.

## Modelos principales

- `User`: usuarios del sistema y rol (`usuario` o `admin`).
- `RegistroReciclaje`: reciclajes registrados por el scanner.
- `CentroReciclaje`: puntos verdes con coordenadas.
- `Recompensa`: premios disponibles para reclamar.
- `CanjeRecompensa`: historial y estado de recompensas reclamadas.

## Endpoints publicos

```txt
GET  /api/health
POST /api/register
POST /api/login
```

## Endpoints protegidos

Requieren token de Laravel Sanctum.

```txt
GET    /api/me
POST   /api/logout
GET    /api/ranking/top-usuarios

GET    /api/registros-reciclaje
POST   /api/registros-reciclaje

GET    /api/centros-reciclaje
GET    /api/recompensas

GET    /api/canjes-recompensa
POST   /api/canjes-recompensa
```

## Endpoints de administrador

Requieren usuario autenticado con `rol = admin`.

```txt
GET    /api/admin/resumen

GET    /api/admin/usuarios
PUT    /api/admin/usuarios/{usuario}
DELETE /api/admin/usuarios/{usuario}

GET    /api/admin/centros-reciclaje
POST   /api/admin/centros-reciclaje
PUT    /api/admin/centros-reciclaje/{centro}
DELETE /api/admin/centros-reciclaje/{centro}

GET    /api/admin/recompensas
POST   /api/admin/recompensas
PUT    /api/admin/recompensas/{recompensa}
DELETE /api/admin/recompensas/{recompensa}

GET    /api/admin/canjes-recompensa
PUT    /api/admin/canjes-recompensa/{canje}
```

## Roles

- `usuario`: puede registrar reciclajes, ver puntos verdes, consultar recompensas y reclamar premios.
- `admin`: puede gestionar usuarios, ubicaciones, recompensas y canjes.

Para convertir un usuario en administrador desde pgAdmin:

```sql
UPDATE users SET rol = 'admin' WHERE email = 'correo@ejemplo.com';
```

## Estados de canje

Un canje de recompensa puede estar en:

- `pendiente`
- `aprobado`
- `entregado`
- `cancelado`

Cuando un usuario reclama una recompensa, queda como `pendiente`. Luego el admin puede aprobarla, marcarla como entregada o cancelarla desde la app.

## Validaciones

El backend valida:

- campos obligatorios,
- correos validos,
- contrasenas minimas,
- roles permitidos,
- coordenadas validas,
- puntos y cantidades numericas,
- estados permitidos para canjes.

## Pruebas basicas

Revisar que Laravel responda:

```bash
php artisan route:list
php artisan test
```

Revisar sintaxis de un archivo PHP:

```bash
php -l app\Http\Controllers\Api\AdminController.php
```

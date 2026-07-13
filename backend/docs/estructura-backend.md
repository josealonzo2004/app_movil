# Estructura del backend EcoSmart

Este documento explica para que sirven los archivos y carpetas mas importantes del backend Laravel de EcoSmart.

## Archivos principales

### `artisan`

Es la herramienta de comandos de Laravel. Se usa para ejecutar tareas como levantar el servidor, crear migraciones, correr pruebas o ejecutar seeders.

Ejemplos:

```bash
php artisan serve
php artisan migrate --seed
php artisan route:list
```

### `composer.json`

Define las dependencias PHP del backend. Aqui se indica que el proyecto usa Laravel y Laravel Sanctum para la autenticacion por tokens.

### `.env`

Contiene la configuracion local del backend: nombre de la app, conexion a base de datos, modo debug, URL de la app y otras variables sensibles.

Este archivo no se debe subir a repositorios publicos porque puede contener claves.

### `.env.example`

Es una plantilla del archivo `.env`. Sirve para que otra persona pueda configurar el proyecto sin conocer las credenciales reales.

Para este proyecto debe configurarse con PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ecosmart
DB_USERNAME=postgres
DB_PASSWORD=tu_clave
```

## Rutas

### `routes/api.php`

Define todos los endpoints REST que consume la app movil.

Incluye:

- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `POST /api/logout`
- CRUD de registros de reciclaje.
- CRUD de centros de reciclaje.
- CRUD de recompensas.
- CRUD de canjes de recompensa.

Las rutas principales estan protegidas con `auth:sanctum`, por eso necesitan enviar un token.

## Controladores

Los controladores reciben las peticiones de la app, validan datos, llaman a los modelos y devuelven respuestas JSON.

### `app/Http/Controllers/Api/AuthController.php`

Maneja la autenticacion.

Funciones principales:

- Registrar usuarios.
- Iniciar sesion.
- Devolver el usuario autenticado.
- Cerrar sesion eliminando el token actual.

### `app/Http/Controllers/Api/RegistroReciclajeController.php`

Maneja los datos generados por el scanner simulado de la app.

Permite:

- Listar registros del usuario.
- Guardar un nuevo reciclaje.
- Ver un registro especifico.
- Editar un registro.
- Eliminar un registro.

Campos importantes:

- `material`
- `cantidad`
- `puntos`
- `ubicacion`
- `latitud`
- `longitud`
- `origen`
- `nota`

### `app/Http/Controllers/Api/CentroReciclajeController.php`

Maneja los centros o puntos de reciclaje.

Permite:

- Crear centros de reciclaje.
- Listarlos.
- Editarlos.
- Eliminarlos.

Campos importantes:

- `nombre`
- `direccion`
- `latitud`
- `longitud`
- `materiales_aceptados`
- `horario`
- `activo`

### `app/Http/Controllers/Api/RecompensaController.php`

Maneja las recompensas disponibles para los usuarios.

Permite:

- Crear recompensas.
- Listarlas.
- Editarlas.
- Eliminarlas.

Campos importantes:

- `nombre`
- `descripcion`
- `puntos_necesarios`
- `cantidad_disponible`
- `activa`

### `app/Http/Controllers/Api/CanjeRecompensaController.php`

Maneja el canje de recompensas usando los puntos acumulados.

Calcula:

- Puntos ganados por registros de reciclaje.
- Puntos ya usados en canjes.
- Puntos disponibles.

Si el usuario tiene puntos suficientes, crea el canje y descuenta disponibilidad de la recompensa.

## Modelos

Los modelos representan las tablas de la base de datos y sus relaciones.

### `app/Models/User.php`

Representa a los usuarios de la app.

Relaciones:

- Un usuario tiene muchos registros de reciclaje.
- Un usuario tiene muchos canjes de recompensa.

Tambien usa `HasApiTokens`, necesario para Laravel Sanctum.

### `app/Models/RegistroReciclaje.php`

Representa la tabla `registros_reciclaje`.

Cada registro pertenece a un usuario y guarda lo que genero el scanner simulado.

### `app/Models/CentroReciclaje.php`

Representa la tabla `centros_reciclaje`.

Guarda informacion de lugares donde se puede reciclar.

### `app/Models/Recompensa.php`

Representa la tabla `recompensas`.

Guarda los beneficios o premios que el usuario puede canjear con puntos.

### `app/Models/CanjeRecompensa.php`

Representa la tabla `canjes_recompensa`.

Relaciona un usuario con una recompensa canjeada.

## Migraciones

Las migraciones crean las tablas de la base de datos.

### `database/migrations/0001_01_01_000000_create_users_table.php`

Crea la tabla `users`, donde se guardan los usuarios.

Campos principales:

- `id`
- `nombre`
- `email`
- `password`

### `database/migrations/*_create_personal_access_tokens_table.php`

Crea la tabla usada por Laravel Sanctum para guardar tokens de autenticacion.

### `database/migrations/*_create_registro_reciclajes_table.php`

Crea la tabla `registros_reciclaje`.

Guarda los datos del scanner simulado enviados desde la app movil.

### `database/migrations/*_create_centro_reciclajes_table.php`

Crea la tabla `centros_reciclaje`.

Guarda puntos o centros de reciclaje.

### `database/migrations/*_create_recompensas_table.php`

Crea la tabla `recompensas`.

Guarda recompensas disponibles para canjear.

### `database/migrations/*_create_canje_recompensas_table.php`

Crea la tabla `canjes_recompensa`.

Guarda los canjes hechos por los usuarios.

## Seeders y factories

### `database/seeders/DatabaseSeeder.php`

Crea datos iniciales para probar la API.

Incluye:

- Usuario demo.
- Registros de reciclaje de ejemplo.
- Centro de reciclaje de ejemplo.
- Recompensa de ejemplo.

Credenciales de prueba:

```txt
Email: demo@ecosmart.test
Password: password123
```

### `database/factories/UserFactory.php`

Permite generar usuarios falsos para pruebas o datos de ejemplo.

## Documentacion del backend

### `docs/api-endpoints.md`

Lista los endpoints principales de la API, ejemplos de peticiones JSON y pasos para levantar el backend.

### `docs/ecosmart-postman-collection.json`

Coleccion importable en Postman para probar login, registros de reciclaje, centros, recompensas y canjes.

## Flujo general de la API

1. El usuario se registra o inicia sesion.
2. Laravel devuelve un token.
3. La app movil guarda ese token.
4. La app envia el token en cada peticion protegida.
5. El scanner simulado genera datos random.
6. La app envia esos datos a `/api/registros-reciclaje`.
7. El backend valida y guarda el registro en PostgreSQL.
8. Los puntos acumulados pueden usarse para canjear recompensas.


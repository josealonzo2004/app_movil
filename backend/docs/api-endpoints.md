# API EcoSmart

Backend Laravel para la app movil EcoSmart. La API usa JSON y autenticacion con token de Laravel Sanctum.

## Configuracion rapida

1. Crear una base de datos MySQL/MariaDB llamada `ecosmart`.
2. Copiar `.env.example` como `.env` si hace falta.
3. Revisar usuario y clave de base de datos en `.env`.
4. Ejecutar:

```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

Credenciales de prueba creadas por el seeder:

```txt
Email: demo@ecosmart.test
Password: password123
```

## Autenticacion

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/health` | Verifica que la API responde. |
| POST | `/api/register` | Registra usuario y devuelve token. |
| POST | `/api/login` | Inicia sesion y devuelve token. |
| GET | `/api/me` | Devuelve usuario autenticado. |
| POST | `/api/logout` | Cierra sesion eliminando el token actual. |

Para rutas protegidas enviar:

```txt
Authorization: Bearer TOKEN
Accept: application/json
```

## Modulo 1: registros de reciclaje

Guarda los datos random generados por el scanner simulado de la app.

| Metodo | Endpoint |
| --- | --- |
| GET | `/api/registros-reciclaje` |
| POST | `/api/registros-reciclaje` |
| GET | `/api/registros-reciclaje/{id}` |
| PUT | `/api/registros-reciclaje/{id}` |
| DELETE | `/api/registros-reciclaje/{id}` |

Ejemplo POST:

```json
{
  "material": "Plastico",
  "cantidad": 2,
  "puntos": 24,
  "ubicacion": "Quito",
  "latitud": -0.1807,
  "longitud": -78.4678,
  "origen": "scanner_simulado",
  "nota": "Dato generado desde la simulacion del scanner"
}
```

## Modulo 2: centros de reciclaje

| Metodo | Endpoint |
| --- | --- |
| GET | `/api/centros-reciclaje` |
| POST | `/api/centros-reciclaje` |
| GET | `/api/centros-reciclaje/{id}` |
| PUT | `/api/centros-reciclaje/{id}` |
| DELETE | `/api/centros-reciclaje/{id}` |

Ejemplo POST:

```json
{
  "nombre": "Punto Verde Sur",
  "direccion": "Av. Maldonado y Moran Valverde",
  "latitud": -0.2851,
  "longitud": -78.5493,
  "materiales_aceptados": ["Plastico", "Papel", "Vidrio"],
  "horario": "Lunes a sabado 08:00 - 16:00",
  "activo": true
}
```

## Modulo 3: recompensas y canjes

| Metodo | Endpoint |
| --- | --- |
| GET | `/api/recompensas` |
| POST | `/api/recompensas` |
| GET | `/api/recompensas/{id}` |
| PUT | `/api/recompensas/{id}` |
| DELETE | `/api/recompensas/{id}` |
| GET | `/api/canjes-recompensa` |
| POST | `/api/canjes-recompensa` |
| GET | `/api/canjes-recompensa/{id}` |
| PUT | `/api/canjes-recompensa/{id}` |
| DELETE | `/api/canjes-recompensa/{id}` |

Ejemplo POST recompensa:

```json
{
  "nombre": "Cupon ecologico",
  "descripcion": "Beneficio por reciclar materiales reutilizables.",
  "puntos_necesarios": 80,
  "cantidad_disponible": 5,
  "activa": true
}
```

Ejemplo POST canje:

```json
{
  "recompensa_id": 1
}
```


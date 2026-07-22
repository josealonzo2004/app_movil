# EcoSmart Frontend

Aplicacion movil del proyecto EcoSmart, un sistema de reciclaje inteligente creado con React Native y Expo. La app permite iniciar sesion, registrar reciclajes mediante un scanner simulado con camara, consultar puntos verdes cercanos, ver ranking de usuarios, reclamar recompensas y administrar datos desde un panel para usuarios con rol admin.

## Tecnologias

- React Native
- Expo SDK 54
- Expo Go para pruebas en celular
- Expo Camera
- Expo Location
- API REST conectada al backend Laravel

## Requisitos

- Node.js instalado
- Expo Go en el celular
- Backend Laravel ejecutandose en la misma red local

## Instalacion

Desde la carpeta `Frontned`:

```bash
npm.cmd --cache .\.npm-cache install
```

## Ejecutar la app

```bash
npm.cmd --cache .\.npm-cache start
```

Luego escanea el QR con Expo Go desde el celular.

## Conexion con el backend

La URL principal de la API esta en:

```txt
src/services/api.js
```

Ejemplo:

```js
const API_BASE_URL = 'http://192.168.100.11:8000/api';
```

Si cambia la IP de tu computadora, actualiza ese valor. El backend debe estar levantado con:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

## Estructura del proyecto

```txt
Frontned/
  App.js
  app.json
  package.json
  assets/
  src/
    components/
    constants/
    data/
    screens/
    services/
    styles/
    utils/
```

## Carpetas principales

- `App.js`: controla sesion, pestana activa, puntos disponibles y datos globales de la app.
- `src/components`: componentes reutilizables como la barra inferior, tarjetas y titulos.
- `src/constants`: configuraciones fijas como las pestanas de navegacion.
- `src/data`: datos de respaldo usados cuando la API no devuelve informacion.
- `src/screens`: pantallas principales de la aplicacion.
- `src/services`: funciones que consumen la API REST del backend.
- `src/styles`: estilos generales de la interfaz.
- `src/utils`: funciones auxiliares para validaciones, scanner simulado y distancia GPS.

## Pantallas

- `LoginScreen`: login y registro de usuarios.
- `HomeScreen`: dashboard con resumen, ranking y estadisticas.
- `ScannerScreen`: usa la camara por unos segundos y genera datos simulados de reciclaje.
- `PointsScreen`: obtiene ubicacion GPS, calcula cercania y abre Google Maps externo.
- `RewardsScreen`: muestra recompensas y permite reclamarlas con puntos.
- `AdminScreen`: panel administrativo para gestionar usuarios, ubicaciones, premios y canjes.

## Servicios conectados

- `authService`: login, registro y sesion.
- `recyclingService`: registros de reciclaje generados por el scanner.
- `centerService`: puntos verdes o centros de reciclaje.
- `rewardService`: recompensas y canjes del usuario.
- `rankingService`: ranking de usuarios por puntos.
- `adminService`: endpoints exclusivos para administradores.

## Roles

La app maneja dos roles:

- `usuario`: accede a inicio, scanner, puntos verdes y recompensas.
- `admin`: ademas de lo anterior, puede ver la pestana Admin.

El panel Admin permite:

- editar usuarios y roles,
- crear y eliminar ubicaciones,
- crear y eliminar recompensas,
- aprobar, entregar o cancelar canjes.

## Validaciones visuales

El frontend valida campos importantes antes de enviarlos al backend:

- correos con formato valido,
- contrasenas minimas,
- coordenadas dentro de rango,
- puntos y cantidades numericas,
- campos obligatorios.

El backend mantiene sus propias validaciones como segunda capa de seguridad.

## Notas

- No cambiar las versiones de `package.json` sin revisar compatibilidad con Expo Go.
- Si Expo Go no abre, normalmente se debe revisar que el celular y la computadora esten en la misma red.
- Si la app no conecta con Laravel, revisar la IP en `src/services/api.js` y que el puerto `8000` este activo.

# EcoSmart - Sistema de reciclaje inteligente

Frontend móvil creado con React Native y Expo para probar en ExpoGo.

## Ejecutar

```bash
npm.cmd --cache .\.npm-cache install
npm.cmd --cache .\.npm-cache start
```

Luego escanea el QR con ExpoGo desde tu celular.

## Nota sobre la camara

La pestaña Scanner usa `expo-camera`. Si aun no esta instalada en `node_modules`, ejecuta:

```bash
npm.cmd --cache .\.npm-cache install
```

La version declarada es `expo-camera ~17.0.10`, compatible con Expo SDK 54.

## Nota sobre ubicacion

La pestaña Puntos usa `expo-location` para pedir GPS, calcular la distancia a cada punto verde y ordenarlos por cercania.

El boton `Ver en mapa` abre Google Maps externo con las coordenadas del punto seleccionado.

La version declarada es `expo-location ~19.0.8`, compatible con Expo SDK 54.

## Conectar con Laravel

Edita `src/services/api.js` y reemplaza `TU-IP-LOCAL` por la IP de tu computadora:

```js
const API_BASE_URL = 'http://192.168.1.25:8000/api';
```

Levanta Laravel desde la carpeta `backend` con:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

El login y el registro ya consumen `/api/login` y `/api/register`.

## Pantallas incluidas

- Inicio con resumen de impacto ambiental.
- Clasificador inteligente simulado por tipo de residuo.
- Registro de reciclaje con materiales y puntos.
- Puntos verdes cercanos.
- Recompensas por puntos acumulados.

## Conexión futura con Laravel

Cuando el backend esté listo, reemplaza los datos simulados por llamadas a la API REST en `src/services/api.js`.

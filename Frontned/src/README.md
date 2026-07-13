# Estructura del frontend

## App.js

Es el archivo principal. Solo controla:

- si el usuario inicio sesion
- la pestana activa
- los registros de reciclaje
- los puntos acumulados

## components

Piezas reutilizables de interfaz:

- `BottomTabs.js`: barra inferior de navegacion.
- `MetricCard.js`: tarjeta de metricas del dashboard.
- `SectionTitle.js`: titulo reutilizable por seccion.

## screens

Pantallas principales de la app:

- `LoginScreen.js`: inicio de sesion y registro visual.
- `HomeScreen.js`: dashboard de inicio.
- `ScannerScreen.js`: simulacion del escaneo QR.
- `PointsScreen.js`: puntos verdes cercanos.
- `RewardsScreen.js`: recompensas disponibles.

## data

Datos simulados para la app:

- materiales
- puntos verdes
- recompensas

## utils

Funciones auxiliares:

- `validators.js`: validacion de correo.
- `scannerSimulator.js`: genera el resultado random del QR.

## styles

- `appStyles.js`: estilos compartidos de la app.

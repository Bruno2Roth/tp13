# README técnico — Adivina el País

## Tecnologías

- React Native y Expo SDK 57.
- JavaScript.
- Context API (`createContext` y `useContext`) para todo el estado y la lógica del juego.
- AsyncStorage para guardar el ranking en el teléfono.
- `react-native-svg` para mostrar las banderas, porque la API entrega direcciones SVG.
- API CountriesNow para países, banderas y capitales.

## Estructura

```text
App.js
app.json
index.js
src/
  components/   piezas visuales; cada una consulta GameContext
  context/      estado, reglas y acciones del juego
  screens/      inicio, partida y ranking
  services/     conexión con las APIs
  utils/        reglas que pueden probarse por separado
tests/          pruebas de reglas
```

## Estado compartido

`GameProvider` envuelve la app. `GameContext` guarda países, país actual, modo, jugador, puntaje, cronómetro, pistas, opciones de capital, ranking, carga y mensajes.

Los componentes usan `useGame()` para leer ese estado y ejecutar acciones. El padre no les pasa el estado del juego por props.

## APIs

- Banderas: `https://countriesnow.space/api/v0.1/countries/flag/images`
- Capitales: `https://countriesnow.space/api/v0.1/countries/capital`

`countriesApi.js` consulta ambas direcciones y relaciona cada capital con su país usando el nombre normalizado. Si falla la consulta de capitales, el modo Banderas puede seguir funcionando.

## Guardado del ranking

El ranking se guarda con AsyncStorage, almacenamiento local para aplicaciones móviles. React Native no usa `localStorage` del navegador.

## Ejecutar en un teléfono

```bash
npm install
npx expo start
```

Abrí Expo Go en el teléfono y escaneá el QR de la terminal. Para esta entrega, la prueba requerida es en el dispositivo móvil físico, no en el navegador web.

## Verificaciones desde la computadora

```bash
npm test
npx expo export --platform android
```

La primera prueba las reglas de juego. La segunda verifica que Expo pueda preparar el paquete Android; ninguna confirma por sí sola que se abrió en un teléfono.

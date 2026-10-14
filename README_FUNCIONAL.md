# README funcional — Adivina el País

## ¿Qué hace el juego?

El juego muestra una bandera y el jugador intenta reconocer el país. También se puede elegir el modo Capitales, donde hay que seleccionar la capital correcta entre varias opciones.

## Cómo se juega

1. El jugador escribe su nombre.
2. Elige **Adivinar banderas** o **Adivinar capitales**.
3. Aparece un país al azar y comienza una cuenta regresiva de 15 segundos.
4. El jugador responde y el puntaje se actualiza.
5. Puede terminar la partida y guardar el resultado en el ranking del teléfono.

## Reglas de puntaje

- Respuesta correcta: suma 10 puntos y los segundos que queden.
- Respuesta incorrecta: resta 1 punto y permite intentar de nuevo.
- Cuando termina el tiempo, se muestra la respuesta y aparece otro país.

**Ejemplo:** si quedan 8 segundos y el jugador acierta, suma 18 puntos: 10 por acertar y 8 por el tiempo restante.

## Modos

### Banderas

Se muestra la bandera. El jugador escribe el nombre del país. Puede pedir una pista: se revela una letra al azar y se descuentan 2 segundos.

### Capitales

Se muestra la bandera y se ofrecen tres capitales. Cada 5 segundos se elimina una opción incorrecta. La capital correcta se obtiene de la API de CountriesNow.

## Jugadores y ranking

Cada partida se asocia al nombre ingresado. Al terminar, el resultado se guarda en el ranking local del teléfono. El ranking muestra hasta diez partidas, ordenadas por puntaje.

**Ejemplo:** si Bruno termina con 42 puntos, queda una fila “Bruno — 42 pts”. Si después juega otra persona, también se registra su resultado y ambos aparecen ordenados.

## Si no hay conexión

El juego muestra un mensaje y ofrece volver a cargar los países. El modo Capitales necesita que la API también entregue capitales; si esos datos no llegan, se informa que ese modo no está disponible.

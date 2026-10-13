# Netim2 backend: guía para agentes

## Proyecto y alcance

Backend del juego Netim2. Es un monolito modular NestJS con API HTTP, sesiones de mundo por Socket.IO, persistencia MongoDB y estado temporal en Redis. Esta guía resume la estructura; verificar los archivos del módulo afectado antes de cambiar su comportamiento. La existencia de tipos, entidades o controladores no implica que una funcionalidad esté integrada o expuesta.

## Tecnologías

- TypeScript 5.7, NestJS 11 y Express; compilación CommonJS con destino ES2023. `DockerFile.dev` utiliza Node 22.
- Mongoose 8 y `@nestjs/mongoose` para MongoDB; `ioredis` para Redis.
- `@nestjs/jwt`, bcrypt, `cookie-parser` y `cookie` para autenticación.
- Socket.IO 4 y gateways de NestJS para conexiones de mundo.
- `class-validator` / `class-transformer` para DTO; Joi y `@nestjs/config` para entorno.
- Throttler, RxJS y Morgan; Jest / ts-jest / Supertest para pruebas; ESLint y Prettier.

Consultar `package.json` y `package-lock.json` para las versiones efectivamente declaradas y resueltas.

## Organización y flujo

```text
src/main.ts          Arranque HTTP, CORS, cookies, validación y respuestas globales
src/app.module.ts    Composición de módulos, configuración, MongoDB y throttling
src/config/         Configuración tipada y validación de variables de entorno
src/modules/        Módulos funcionales y de infraestructura
test/               Configuración y pruebas e2e
```

Dentro de cada módulo se utilizan, según necesidad: `controller`, `service`, `repository`, `schema`, `mapper`, `entity`/`entities`, `dto`, `types`, `const`, `config` y `factories`. Hay variantes existentes en singular/plural; seguir la organización del componente intervenido. `fight` incorpora `engine`, `manager`, procesadores y resolvers.

El flujo habitual es controlador → servicio → repositorio/Mongoose, con mappers para convertir documentos, datos planos y entidades. No es uniforme: algunos repositorios devuelven documentos, otros objetos planos o entidades. Las entidades contienen comportamiento en memoria y suelen serializarse mediante `toPrimitives()`; sus cambios no se guardan automáticamente.

La comunicación interna usa servicios inyectados por NestJS y también imports directos de entidades, factories, tipos y constantes. Revisar tanto `imports`/`providers`/`exports` de los módulos como los consumidores reales. No hay un bus de eventos o microservicios coordinando los módulos revisados.

## Módulos y dependencias principales

| Módulo | Responsabilidad y relaciones |
| --- | --- |
| `user` | Registro, credenciales, cuenta, reino y almacenes; MongoDB y utilidades de hashing. |
| `auth` | JWT, login y refresh; depende de `user` y `redis`. |
| `session` | Sesión activa de mundo y presencia por socket; depende de `auth`, `character` y `redis`. |
| `character` | Administración de personajes, entidad de dominio y calculadores de estadísticas; depende de `user`, `auth`, `shared` y MongoDB. Usa clases de inventario y habilidades directamente. |
| `gameData` | Datos de selección, razas, reinos y resúmenes; consume `character` y `auth`. |
| `item` | Catálogos, factories, hidratación de objetos y bonus implícitos; utiliza `shared`. |
| `inventory` | Lógica de posiciones, apilado y consumo en la entidad `Inventory`; su servicio está vacío. Usado por cuentas y personajes. |
| `bonus` | Generación, pesos y límites de bonus; utiliza `shared`. |
| `skill` | Catálogos, entidades y escalado de habilidades; utiliza `shared`. |
| `mob` | Consulta y persistencia MongoDB de enemigos; consumido por combate. |
| `fight` | Motor de combate por turnos, efectos, estadísticas y reproducción; depende de `character`, `mob` y `shared`. |
| `drop` | Generación de objetos, EXP y yang; utiliza `item`, `bonus`, `shared` y datos de enemigos. |
| `misiones` | Catálogo, progreso y recompensas; utiliza `item` y la tabla de EXP de personajes. |
| `historial` | Consulta y eliminación de historiales por personaje en MongoDB. |
| `shared` | RNG, hashing, utilidades de bonus/estadísticas y formato HTTP; distinto del paquete `netim2-shared`. |
| `redis` | Cliente Redis y su ciclo de vida. |

MongoDB registra modelos para usuarios, personajes, mobs e historiales. Inventarios, equipos y habilidades se guardan embebidos en los documentos correspondientes. Muchos catálogos y reglas de balance son constantes TypeScript, no colecciones MongoDB.

## API, autenticación y sesiones

- `main.ts` configura CORS para `URL_FRONT` con credenciales, cookies y `ValidationPipe({ whitelist: true, transform: true })`.
- `ApiResponseInterceptor` normaliza éxitos como `{ success, message, data }`; los controladores pueden devolver `{ data, message? }`. `ApiExceptionFilter` devuelve errores con `{ success: false, message, errors }`.
- La autenticación usa cookies JWT de acceso y refresh. Redis conserva el registro de refresh por `authSessionId`. `AccessTokenGuard` valida acceso y completa `request.user`; no es un guard global.
- La sesión de mundo es distinta de la sesión de autenticación: el gateway valida token y propiedad del personaje, registra cuenta/personaje/socket en Redis y renueva su TTL. Emite `session:ready`, `session:replaced` y `session:expired`.
- `ActiveWorldSessionGuard` verifica `x-world-session-id`, pero actualmente no está aplicado a rutas. No asumir que estar autenticado implica tener personaje activo.
- Existe throttling global y límites específicos para login/registro.

## Contratos compartidos

`netim2-shared` se consume como dependencia Git; actualmente `package.json` apunta a `github:FrancoMiralles98/netim2-shared#v0.2.19`. Proporciona tipos de personajes, inventario, ítems, habilidades, estadísticas y combate, además de constantes utilizadas en ejecución.

- Reutilizar los contratos existentes y comprobar sus exportaciones y consumidores antes de cambiarlos.
- Una carpeta vecina `netim2-shared` no está vinculada automáticamente: verificar la versión instalada y el lockfile, sin asumir que coincide con otro checkout.
- Los tipos compartidos no sustituyen DTO con validadores ni validación del esquema en ejecución.
- Ante cambios de datos, revisar conjuntamente contrato, DTO, esquema, mapper, valores iniciales y compatibilidad de consumidores, incluido el frontend cuando corresponda.

## Criterios para cambios

- Mantener la separación existente: entrada HTTP en controladores, coordinación en servicios, persistencia en repositorios y comportamiento de dominio en entidades/calculadores. Registrar nuevas dependencias en el módulo Nest correspondiente.
- Respetar la comprobación de propiedad desde la cuenta autenticada al operar con personajes. Conservar la distinción entre IDs de documento, IDs de catálogo e IDs de instancia de ítems.
- No asumir persistencia, transacciones o recalculado implícitos. Identificar quién guarda el resultado y cómo coordina escrituras relacionadas; actualmente crear un personaje y asignar reino a la cuenta son escrituras separadas.
- Preservar los contratos y nombres existentes: conviven español/inglés e imports relativos y `src/...`. Evitar renombrados o reformateos ajenos a la tarea.
- Los calculadores de estadísticas trabajan sobre copias; mantener sus garantías de no mutación. Las entidades sí pueden mutar estado en memoria: comprobar las referencias y efectos antes de reutilizar objetos.
- Verificar los puntos de integración: varios controladores están vacíos; los calculadores de personaje no están conectados a creación/consulta/combate. `fightVsMobs()` ejecuta el motor pero no devuelve ni persiste su resultado ni coordina drops, misiones e historial. La ruta HTTP actual de combate es `/fight/lab`.
- Los eventos de reproducción de combate son datos del resultado; no implican integración por eventos entre módulos ni transmisión de acciones por WebSocket.
- Revisar y ejecutar pruebas relevantes al comportamiento modificado. Hay pruebas específicas de cálculos, pero también plantillas que solo comprueban existencia; no asumir cobertura completa ni que toda la suite pasa.

## Entorno y comandos

La validación está en `src/config/env-validation.ts`: requiere `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES`, `DB_URI_DEV`, `DB_URI_PROD`, `URL_FRONT` y `REDIS_URL`; también configura `PORT` y `NODE_ENV`. La URI MongoDB se elige según entorno. Arrancar `AppModule` requiere la configuración y servicios externos correspondientes; el e2e actual importa ese módulo completo.

| Comando | Uso |
| --- | --- |
| `npm ci` | Instalar dependencias según lockfile; incluye acceso a la dependencia Git compartida. |
| `npm run start:dev` | Desarrollo con watch. |
| `npm start` / `npm run start:debug` | Arranque normal / depuración con watch. |
| `npm run build` | Compilar con Nest a `dist`. |
| `npm run start:prod` | Ejecutar el resultado compilado. |
| `npm test -- --runInBand` | Suite Jest de `src/**/*.spec.ts`. |
| `npm test -- --runInBand src/modules/character/services/statsCalculator` | Ejemplo de pruebas focalizadas. |
| `npm run test:watch` / `npm run test:cov` | Watch / cobertura. |
| `npm run test:e2e` | Pruebas de integración en `test/`. |
| `npm run lint` / `npm run format` | ESLint con `--fix` / Prettier con `--write`: ambos modifican archivos. |

Para cambios acotados, evitar ejecutar formateos globales que alteren archivos fuera del alcance.

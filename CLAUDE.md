# CLAUDE.md — Instrucciones para Claude (y para cualquier integrante)

> Este archivo lo lee Claude Code automáticamente al abrir el repo.
> Si eres un integrante del equipo, **léelo también**: aquí están las reglas de trabajo.
> Hay notas específicas en [server/CLAUDE.md](server/CLAUDE.md) y [client/CLAUDE.md](client/CLAUDE.md).

## 1. Qué es este proyecto

**Cloud Media Vault**: taller colaborativo de la asignatura *Desarrollo de Experiencias Multimedia
para la Web* (UAO). Es una app fullstack para subir imágenes, videos y PDF a la nube
(**Cloudinary**) y guardar sus metadatos en una base de datos (**MongoDB Atlas + Mongoose**)
mediante una API REST.

- Arquitectura: **Ruta B (desacoplada)**: `client/` (React + Vite) consume `server/` (Express + multer + cors).
- El enunciado resumido y la rúbrica están en [docs/ENUNCIADO.md](docs/ENUNCIADO.md).
- El contrato de la API (lo que **todos** deben respetar) está en [docs/API.md](docs/API.md).
- **El estado actual de cada tarea está en [docs/ESTADO.md](docs/ESTADO.md). Léelo antes de empezar.**

## 2. Antes de escribir código (Claude: haz esto siempre)

1. Lee [docs/ESTADO.md](docs/ESTADO.md) para saber qué está hecho, qué está en progreso y quién lo hace.
2. Pregunta al usuario **qué rol tiene** (1 a 5) si no lo ha dicho. Cada rol es dueño de ciertos
   archivos (ver [docs/ROLES.md](docs/ROLES.md)). **Trabaja solo en los archivos de ese rol.**
   Si hace falta tocar archivos de otro rol, avisa al usuario antes y explícale por qué.
3. Busca los comentarios `TODO(Rol N)` del rol del usuario: ahí está descrito lo que falta.
4. Respeta el contrato de [docs/API.md](docs/API.md). Si un cambio rompe el contrato, **no lo
   hagas en silencio**: actualiza `docs/API.md` y dile al usuario que avise al equipo.

## 3. REGLA DE ORO: el repositorio se mantiene LIMPIO

**Las pruebas y experimentos NO se hacen dentro del repositorio.**

- ❌ No crear dentro del repo: scripts de prueba sueltos (`test.js`, `prueba.js`, `borrar.js`…),
  archivos multimedia de ejemplo (imágenes, videos, PDF), carpetas `pruebas/`, `tmp/`, `scratch/`,
  copias de archivos (`App copy.jsx`, `index_old.js`), ni archivos `.env` con datos reales fuera de
  donde corresponde.
- ✅ Para probar algo:
  - Usa una carpeta **fuera** del repo, por ejemplo `../taller3-pruebas/` (al lado del repo, no dentro).
  - Claude: usa tu directorio *scratchpad* temporal para scripts y archivos de prueba.
  - Para probar la API usa `curl`, Postman, Thunder Client o el navegador; no crees archivos en el repo.
  - Los archivos multimedia de prueba se guardan en tu carpeta personal (Descargas, Escritorio…).
- ✅ Antes de cada commit revisa `git status`: solo deben aparecer archivos que de verdad son
  parte de tu tarea. Si aparece algo raro, **no lo subas**.
- El `.gitignore` tiene una "red de seguridad" para carpetas de prueba comunes, pero **no confíes en
  él**: la regla es no crearlas en el repo.

## 4. Seguridad (cuenta en la nota)

- **Nunca** subir `.env` ni credenciales reales (Cloudinary, MongoDB). Solo `.env.example` con
  valores de ejemplo. Las credenciales se comparten por un canal privado del equipo, no por GitHub.
- **Nunca** poner credenciales en el código del `client/`: todo lo que está en el frontend es público.
  `CLOUDINARY_API_SECRET` y `MONGODB_URI` solo existen en `server/.env`.
- Si por error se sube una credencial: avisar al equipo, **rotarla** en Cloudinary/Atlas y
  limpiarla. Borrarla en un commit nuevo NO es suficiente (queda en el historial).

## 5. Git y commits (la rúbrica evalúa el historial)

La rúbrica exige **commits de todos los integrantes, acordes a su rol**. Por eso:

- Cada integrante hace commits **con su propia cuenta** (`git config user.name` y `user.email`
  deben coincidir con su cuenta de GitHub, si no, GitHub no le cuenta los commits).
- Claude: **no hagas commit ni push a menos que el usuario lo pida.** Nunca `git push --force` a `main`.
- Trabajar en ramas: `rol1/...`, `rol2/...`, etc. y abrir Pull Request a `main`.
- Formato de mensaje: `tipo(rolN): descripción en español`. Ejemplos:
  - `feat(rol2): validar tipo MIME y tamaño en POST /api/archivos`
  - `fix(rol5): mostrar peso en MB en la tarjeta`
  - `docs(rol1): actualizar .env.example con CLOUDINARY_FOLDER`
- Commits pequeños y frecuentes > un commit gigante al final.
- Detalle completo en [docs/FLUJO-GIT.md](docs/FLUJO-GIT.md).

## 6. Al terminar una tarea (Claude: haz esto siempre)

1. Actualiza [docs/ESTADO.md](docs/ESTADO.md): cambia el estado de la tarea (⬜ → 🟡 → ✅) y
   agrega una línea en la *Bitácora* con fecha, rol y qué se hizo.
2. Si agregaste una dependencia, variable de entorno o endpoint, actualiza `README.md`,
   `.env.example` y/o `docs/API.md` según corresponda.
3. Elimina los `TODO(Rol N)` que ya quedaron resueltos (no dejes comentarios obsoletos).
4. Revisa que no haya `console.log` de depuración olvidados ni errores en la consola del navegador.
5. Muestra al usuario el `git status` para que confirme que solo hay archivos de su tarea.

## 7. Convenciones de código

- Idioma: nombres de variables, funciones, comentarios y mensajes al usuario **en español**
  (ej. `subirArchivo`, `tamanoBytes`). Sin tildes ni ñ en identificadores (`tamano`, no `tamaño`).
- JavaScript con **ES Modules** (`import`/`export`) en server y client. Sin TypeScript.
- Node **22 o superior** (ver `.nvmrc`).
- No agregar librerías nuevas sin necesidad. Si hace falta, avisar al equipo y documentarlo.
- Los límites y tipos permitidos están duplicados a propósito en
  `server/src/constants/archivos.js` y `client/src/constants/archivos.js`: **si cambias uno,
  cambia el otro**.

## 8. Mapa rápido del repositorio

```
.
├── CLAUDE.md                 ← este archivo (reglas)
├── README.md                 ← entregable: integrantes, roles, arquitectura, instrucciones
├── docs/
│   ├── ENUNCIADO.md          ← resumen del taller + checklist de la rúbrica
│   ├── ESTADO.md             ← tablero de avance por rol + bitácora  (ACTUALIZAR)
│   ├── ROLES.md              ← qué hace cada rol y qué archivos le pertenecen
│   ├── API.md                ← contrato de la API REST
│   ├── FLUJO-GIT.md          ← ramas, commits, PRs
│   └── SUSTENTACION.md       ← guion de la demo de 8 minutos
├── server/                   ← Express + multer + Cloudinary + Mongoose (Roles 1, 2, 3)
└── client/                   ← React + Vite (Roles 4, 5)
```

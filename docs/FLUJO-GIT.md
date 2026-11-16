# Flujo de trabajo con Git y GitHub

> La rúbrica (15%) evalúa que el historial muestre **aportes de todos, acordes a su rol**.
> Un repo donde una sola persona hace todos los commits saca 1.0 en ese criterio.

## 0. Configuración inicial (cada integrante, una sola vez)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "el-correo-de-tu-cuenta-de-github@ejemplo.com"
```

⚠️ El correo **debe** ser uno registrado en tu cuenta de GitHub. Si no, tus commits aparecen sin
dueño y no cuentan como tuyos.

```bash
git clone <URL-del-repo>
cd <carpeta-del-repo>
```

Luego sigue las instrucciones de ejecución del [README](../README.md#instrucciones-de-ejecución).

## 1. Ramas

- `main`: siempre debe funcionar. **Nadie hace push directo a `main`** (salvo la base inicial).
- Una rama por tarea, con prefijo del rol:
  - `rol1/modelo-archivo`, `rol2/multer-validaciones`, `rol3/delete-sincronizado`,
    `rol4/drag-and-drop`, `rol5/galeria-filtros`

```bash
git checkout main
git pull
git checkout -b rol2/multer-validaciones
```

## 2. Commits

Formato: `tipo(rolN): descripción corta en español`

| tipo | para qué |
|---|---|
| `feat` | funcionalidad nueva |
| `fix` | corrección de error |
| `docs` | documentación (README, docs/, comentarios) |
| `style` | estilos CSS / formato sin cambiar lógica |
| `refactor` | reorganizar código sin cambiar comportamiento |
| `chore` | configuración, dependencias |

Ejemplos:
```
feat(rol1): crear modelo Archivo con índices por fecha y tipo
feat(rol2): subir buffer a Cloudinary con upload_stream
feat(rol3): DELETE elimina primero en Cloudinary y luego en MongoDB
feat(rol4): barra de progreso con XMLHttpRequest
feat(rol5): vista previa de video con controles nativos
docs(rol5): registrar resultados de QA en ESTADO.md
```

Buenas prácticas:
- Commits **pequeños y frecuentes** (uno por cada avance que funcione).
- Antes de `git add`, revisa `git status` y `git diff`. **No uses `git add .` a ciegas.**
- Nunca subir `.env`, `node_modules`, archivos de prueba o multimedia de ejemplo.

## 3. Pull Requests

```bash
git push -u origin rol2/multer-validaciones
```

En GitHub: *Compare & pull request* → base `main`. Completar la plantilla del PR.
Idealmente otro integrante revisa y aprueba antes de hacer *merge* (eso también deja evidencia de
trabajo colaborativo).

Después del merge, todos actualizan:
```bash
git checkout main
git pull
```

## 4. Conflictos

Si tu rama queda desactualizada:
```bash
git checkout main && git pull
git checkout rol2/mi-rama
git merge main
# resolver conflictos en el editor, luego:
git add <archivos-resueltos>
git commit
```

Si el conflicto es en un archivo de otro rol, **habla con esa persona** antes de resolverlo.

## 5. Si usas Claude Code

- Claude lee `CLAUDE.md` automáticamente. Dile tu rol al empezar: *"Soy el Rol 3"*.
- Pídele explícitamente cuando quieras commit: *"haz commit de esto"*. Claude no debe hacer commit
  ni push por su cuenta.
- El commit queda a **tu nombre** (usa tu `git config`), así que cuenta como aporte tuyo. Revisa
  siempre lo que Claude cambió (`git diff`) antes de hacer commit: en la sustentación te pueden
  preguntar por tu código.

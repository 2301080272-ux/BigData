# Proyecto: Admin local + sitio público desplegado

Este workspace contiene dos aplicaciones:

- **`admin/`** — Panel de administración que corre en tu computadora local.
- **`public-site/`** — Sitio público que desplegarás en Vercel (o Netlify) desde un repositorio GitHub.

## ¿Qué hace?

1. Ejecutas el panel de admin en tu PC (`http://localhost:3001`).
2. Creas **apartados**, escribes contenido y subes archivos de cualquier tipo.
3. Los datos se guardan en una **base de datos SQLite local** (`admin/prisma/dev.db`).
4. Los archivos subidos se guardan en `admin/public/uploads/`.
5. Al presionar **Publicar en el sitio**, el admin:
   - genera un `content.json` con todo el contenido,
   - copia los archivos a `public-site/public/uploads/`,
   - hace `git commit` y `git push` al repositorio `public-site`,
6. Vercel/Netlify detecta el push y **reconstruye el sitio público automáticamente**.

## Estructura de archivos

```
BigData/
├── admin/
│   ├── .env                      ← variables locales
│   ├── prisma/
│   │   ├── schema.prisma         ← modelo de datos
│   │   └── dev.db                ← BASE DE DATOS LOCAL (SQLite)
│   ├── public/uploads/           ← archivos subidos localmente
│   ├── app/                      ← panel de administración
│   │   ├── page.tsx              ← Dashboard
│   │   ├── sections/             ← Apartados (lista, crear, editar)
│   │   ├── files/                ← Gestor de archivos
│   │   └── publish/              ← Publicar al sitio
│   └── components/               ← Sidebar, formularios, tarjetas, etc.
├── public-site/
│   ├── .git/                     ← REPOSITORIO GIT conectado a GitHub
│   ├── content.json              ← contenido publicado por admin
│   ├── public/uploads/           ← archivos publicados
│   └── app/                      ← sitio público
└── README.md
```

## Requisitos

- [Node.js](https://nodejs.org) (tienes v22 instalado)
- [Git](https://git-scm.com)
- Una cuenta en [GitHub](https://github.com)
- Una cuenta en [Vercel](https://vercel.com) o [Netlify](https://netlify.com)

## 1. Configurar la base de datos local

La base de datos ya está lista. Verifica que `admin/.env` existe:

```env
DATABASE_URL="file:./prisma/dev.db"
PUBLIC_SITE_PATH="../public-site"
```

Si no existe:

```powershell
cd admin
Copy-Item .env.example .env
npx prisma db push
npx prisma generate
```

**Dónde queda la base de datos:** `admin/prisma/dev.db`. Está ignorada en Git, nunca se sube a GitHub.

## 2. Ejecutar el panel de administración local

```powershell
cd admin
npm run dev
```

Abre **http://localhost:3001**.

### Páginas del admin

- **Dashboard** (`/`) — resumen con número de apartados y archivos.
- **Apartados** (`/sections`) — lista, crear, editar y eliminar apartados.
- **Editar apartado** (`/sections/[id]`) — sube archivos (PDF, Power BI exportado, imágenes, etc.) y agrega enlaces/URLs (por ejemplo a un reporte de Power BI online).
- **Archivos** (`/files`) — ver todos los archivos subidos, previsualizar imágenes y eliminarlos.
- **Publicar** (`/publish`) — envía el contenido al repositorio y al sitio público.

### Tipos de contenido soportados

- **Archivos:** cualquier tipo (PDF, imágenes, Excel, Power BI exportado, etc.).
- **Enlaces/URLs:** título + enlace. Ideal para reportes de Power BI, dashboards o documentos en la nube.
- El sitio público previsualiza automáticamente los PDFs embebidos.

## 3. Repositorio de GitHub para el sitio público

**Ya está conectado:**

```
https://github.com/2301080272-ux/BigData.git
```

`public-site` apunta a ese remote y el push inicial ya se hizo.

Si en otro equipo necesitas reconectarlo:

```powershell
cd public-site
git remote add origin https://github.com/2301080272-ux/BigData.git
git branch -M main
git push -u origin main
```

## 4. Desplegar el sitio público en Vercel

1. Ve a https://vercel.com/new
2. Inicia sesión con tu cuenta de GitHub.
3. Importa el repositorio `2301080272-ux/BigData`.
4. Configura:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Presiona **Deploy**.

Cada vez que presiones **Publicar en el sitio** desde el admin, Vercel reconstruirá y publicará el sitio automáticamente.

### Si prefieres Netlify

1. Ve a https://app.netlify.com/start
2. Conecta el repo `2301080272-ux/BigData`.
3. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Presiona **Deploy site**.

## 5. Flujo de trabajo en el admin

1. Abre http://localhost:3001 y ve a **Apartados**.
2. Presiona **+ Nuevo apartado** y llena los datos.
3. Al guardar, se abre la página de **Gestionar contenido** del apartado.
4. Ahí verás dos secciones:
   - **Archivos** — sube PDFs, imágenes, Excel, Power BI exportado, etc.
   - **Enlaces** — agrega URLs (reportes de Power BI, dashboards, documentos en la nube).
5. Cuando termines, ve a **Publicar** y presiona **Publicar ahora**.
6. Vercel/Netlify reconstruirá el sitio automáticamente.

## Comandos útiles

| Acción | Comando |
|--------|---------|
| Correr admin local | `cd admin; npm run dev` |
| Correr sitio público local | `cd public-site; npm run dev` |
| Construir admin | `cd admin; npm run build` |
| Construir sitio público | `cd public-site; npm run build` |
| Sincronizar DB con Prisma | `cd admin; npx prisma db push` |

## Preguntas frecuentes

### ¿Dónde pongo mi base de datos?
En `admin/prisma/dev.db` (SQLite). Es local y no se sube al repo.

### ¿Dónde van mis archivos subidos?
- Localmente: `admin/public/uploads/`
- Publicados: `public-site/public/uploads/`

### ¿Dónde van mis despliegues?
En Vercel/Netlify, conectados al repositorio `public-site` de GitHub.

### ¿Qué pasa si no tengo internet al publicar?
El admin guarda todo localmente. Cuando vuelvas a tener internet, presiona **Publicar en el sitio** de nuevo.

### ¿Puedo usar otro tipo de base de datos?
Sí. Cambia el `provider` en `admin/prisma/schema.prisma` y la `DATABASE_URL` en `admin/.env`. Consulta la documentación de Prisma.

### ¿Necesito pasar alguna credencial para publicar?
No. El admin usa `git push` con la sesión de Git que ya tienes en Windows (Git Credential Manager). La primera vez que hiciste push se guardó la autenticación.

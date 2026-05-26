# 🎲 Punto Meeple — Frontend

Aplicación web SPA (Single Page Application) del proyecto Punto Meeple, una herramienta de gestión para asociaciones de juegos de mesa y rol. Desarrollada con React, TypeScript y Vite.

> ⚠️ Este repositorio está pensado para ejecutarse dentro del entorno Docker del proyecto. Consulta el [repositorio de Docker](https://github.com/sergiova97/punto-meeple-docker) para las instrucciones de instalación completas.

## 🧱 Stack tecnológico

- **React 19** — biblioteca de componentes UI
- **TypeScript** — tipado estático
- **Vite** — bundler y servidor de desarrollo
- **React Router** — enrutamiento client-side
- **Zustand** — gestión de estado global (autenticación)
- **Axios** — cliente HTTP con interceptores JWT
- **Tailwind CSS** — utilidades de estilos
- **FontAwesome** — iconografía

## 📁 Estructura del proyecto

```
src/
├── api/            # Llamadas a la API REST por módulo
├── components/
│   ├── ui/         # Componentes reutilizables (Table, Modal, Badge, Button, Pagination)
│   ├── layout/     # AppShell, Sidebar, TopBar, BottomBar, NavSections
│   ├── dashboard/  # Calendario interactivo
│   ├── fees/       # Componentes de cuotas
│   ├── games/      # Componentes de juegos (GameCard, GamesGrid, modales)
│   ├── loans/      # Componentes de préstamos
│   └── events/     # Componentes de eventos
├── pages/          # Páginas por módulo (auth, dashboard, users, fees, games, loans, events)
├── router/         # Configuración de rutas y PrivateRoute
├── store/          # Estado global con Zustand (auth)
├── hooks/          # Hooks reutilizables (useIsMobile, useDebounce)
├── types/          # Tipos e interfaces TypeScript
├── utils/          # Utilidades (logger, routeNames, errorMessages)
└── config.ts       # Configuración global (URL de la API)
```

## 📋 Requisitos

El proyecto se ejecuta dentro de Docker. Consulta el [repositorio de Docker](https://github.com/sergiova97/punto-meeple-docker) para los requisitos y la instalación del entorno.

Para desarrollo local sin Docker:
- Node.js >= 18
- npm

## 📥 Instalación

Sigue las instrucciones del [repositorio de Docker](https://github.com/sergiova97/punto-meeple-docker). Una vez levantado el entorno completo con frontend, accede al contenedor:

```bash
docker compose exec frontend bash
```

Instala las dependencias:

```bash
npm install
```

Crear el archivo .env y editar las variables de entorno

```bash
cp .env.dist .env
```


Levanta el servidor de desarrollo:

```bash
npm run build
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## 🚀 Uso

La aplicación se comunica con el backend a través de un proxy configurado en Vite (`/api` → `http://backend:3000`). Asegúrate de que el backend está levantado y las migraciones ejecutadas antes de usar el frontend.

El acceso a la aplicación requiere usuario y contraseña. El registro de nuevos socios es responsabilidad del administrador.

## 📖 Módulos de la aplicación

| Módulo | Ruta | Roles con acceso |
|---|---|---|
| Dashboard | `/dashboard` | Todos |
| Socios | `/users`, `/users/:id` | ADMIN, RRHH |
| Juegos de mesa | `/board-games` | Todos |
| Libros de rol | `/rpg-books` | Todos |
| Categorías y mecánicas | `/game-settings` | ADMIN, BIBLIOTECARIO |
| Préstamos | `/loans` | Todos |
| Mis préstamos | `/my-loans` | Todos |
| Todas las cuotas | `/fees` | ADMIN, TESORERO |
| Mis cuotas | `/my-fees` | Todos |
| Revisión de pagos | `/payments` | ADMIN, TESORERO |
| Todos los eventos | `/events` | Todos |
| Mis eventos | `/my-events` | Todos |

## 🔐 Autenticación

La autenticación se gestiona mediante JWT. El token se almacena en `localStorage` bajo la clave `pm_token` y se adjunta automáticamente en todas las peticiones a la API mediante un interceptor de Axios. Si el token caduca o es inválido, el usuario es redirigido automáticamente a la página de login.
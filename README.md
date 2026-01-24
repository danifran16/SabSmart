# React + Vite



# Que es un componente:
una parte reutilizable de la interfaz
 - boton
 - formulario
 - barra navegacion
 - pagina completa ( login, home, dashboard, etc)

piensalo como un lego, componentes chicos se combinas, y los grandes forman paginas


# Tipos de componentes en React
Componentes de UI (reutilizables)
Son piezas genéricas:
  Button
  Input
  Modal
  Card
No saben nada del negocio, solo muestran cosas.

# Componentes de página (Pages / Views)
Representan una pantalla completa:
  Login
  Register
  Home
  Profile
Usan varios componentes pequeños dentro.

# Componentes de layout
Definen la estructura general:
  Header
  Footer
  Sidebar
  Layout principal


# Estructura típica de un proyecto React
src/
│
├── components/        # Componentes reutilizables (UI)
│   ├── Button.jsx
│   ├── Input.jsx
│   └── Navbar.jsx
│
├── pages/             # Páginas (pantallas)
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Home.jsx
│
├── layouts/           # Estructura visual
│   └── MainLayout.jsx
│
├── services/          # Llamadas al backend (API)
│   └── authService.js
│
├── hooks/             # Hooks personalizados
│   └── useAuth.js
│
├── context/           # Context API (estado global)
│   └── AuthContext.jsx
│
├── assets/            # Imágenes, íconos, fuentes
│
├── styles/            # CSS o estilos globales
│   └── main.css
│
├── App.jsx            # Rutas principales
└── main.jsx           # Punto de entrada


# ¿Cuándo usar .js y cuándo .jsx?
.jsx
  Úsalo cuando el archivo retorna HTML (JSX):
    Componentes React
    Pages
    Layouts

.js
Úsalo cuando NO hay JSX, solo lógica:
  Servicios
  Helpers
  Configuraciones

Buena práctica:
Componentes → .jsx
Lógica → .js

# ejemplo estructura:
src/
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   │
│   └── layout/    # componentes que no cambian entre paginas
│       ├── Navbar.jsx
│       └── Sidebar.jsx
│
├── features/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── LoginForm.jsx
│   │   └── authService.js
│   │
│   ├── clientes/
│   │   ├── ClientesPage.jsx
│   │   ├── ClienteForm.jsx
│   │   ├── ClienteList.jsx
│   │   └── clientesService.js
│   │
│   └── pedidos/
│       ├── PedidosPage.jsx
│       ├── PedidoForm.jsx
│       ├── PedidoTable.jsx
│       └── pedidosService.js
│
├── router/
│   └── AppRouter.jsx
│
├── App.jsx
└── main.jsx


# ejemplo separando usuario y cliente

src/
│
├── components/
│   ├── ui/
│   └── layout/
│       ├── AdminLayout.jsx
│       └── UserLayout.jsx
│
├── features/
│   ├── auth/
│   │   └── LoginPage.jsx
│   │
│   ├── pedidos/
│   │   ├── admin/
│   │   │   ├── AdminPedidosPage.jsx
│   │   │   ├── PedidoForm.jsx
│   │   │   └── PedidoEstadoSelect.jsx
│   │   │
│   │   └── user/
│   │       ├── MisPedidosPage.jsx
│   │       └── PedidoDetallePage.jsx
│   │
│   └── shared/
│       └── pedidoService.js
│
├── context/
│   └── AuthContext.jsx
│
├── router/
│   └── AppRouter.jsx

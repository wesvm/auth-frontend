# SFull Authentication System (Frontend)

Una aplicación de autenticación completa desarrollada con **React 19**, **TypeScript** y **Vite**.

---

## Características Principales

- **Registro e Inicio de Sesión**: Autenticación mediante tokens JWT (Bearer Access Tokens).
- **Autenticación de Dos Factores (2FA / TOTP)**: 
  - Generación e integración de código QR para apps autenticadoras (Google Authenticator, Authy, 1Password).
  - Flujo de verificación intermedia mediante *2FA Tickets* de corta duración.
- **Verificación de Correo Electrónico**: Confirmación de cuenta mediante enlace y token único.
- **Recuperación de Contraseña**: Flujos de recuperación (*Forgot Password*) y restablecimiento seguro (*Reset Password*).
- **Panel de Usuario & Configuración**: Edición de perfil y activación / desactivación dinámica de 2FA.
- **Modo Oscuro / Claro**: Selector de tema integrado (`ThemeProvider`).
- **UI/UX Moderna & Accesible**: Componentes estilizados con Tailwind CSS v4, animaciones fluidas y notificaciones interactivas (*Sonner toasts*).

---

## Stack Tecnológico

| Tecnología | Descripción |
| :--- | :--- |
| **React 19** | Biblioteca principal de interfaz de usuario |
| **TypeScript** | Tipado estático estricto en toda la aplicación |
| **Vite 7** | Bundler y servidor de desarrollo ultra-rápido |
| **TanStack Router** | Enrutamiento seguro basado en archivos (*File-based Routing*) |
| **TanStack Query v5** | Gestión de estado asíncrono, caché y fetching de API |
| **React Hook Form + Zod** | Gestión y validación declarativa de formularios con inferencia de tipos |
| **Tailwind CSS v4** | Framework de estilos CSS utilitario moderno |
| **Shadcn UI & Lucide** | Primitivas de interfaz accesibles e iconografía |
| **Biome JS** | Herramienta de alta velocidad para Linting y Formateo de código |

---

## Estructura del Proyecto

```text
src/
├── components/          # Componentes de UI reutilizables
│   ├── auth/            # Formularios (login, signup, reset password, etc.)
│   ├── settings/        # Configuración de usuario y gestión 2FA
│   ├── ui/              # Componentes base (button, card, dialog, input, etc.)
│   ├── mode-toggle.tsx  # Toggle de tema Claro/Oscuro
│   └── theme-provider.tsx
├── hooks/               # Custom hooks de la aplicación (useAuth, useMobile)
├── lib/                 # Librerías, servicios de API y esquemas
│   ├── api/             # Cliente Axios, interceptores JWT y endpoints
│   ├── validations/     # Esquemas de validación Zod
│   └── errors.ts        # Manejador centralizado de errores
├── routes/              # Estructura de rutas de TanStack Router
│   ├── __root.tsx       # Ruta raíz y Layout global
│   ├── _app-layout.tsx  # Layout para rutas protegidas (Home, Settings)
│   └── _auth-layout.tsx # Layout para rutas públicas (Login, Register, 2FA)
├── types/               # Definiciones de tipos TypeScript y modelos de datos
├── index.css            # Estilos globales y diseño con Tailwind v4
└── main.tsx             # Punto de entrada de la aplicación
```

---

## Instalación y Configuración

### Requisitos Previos

- **Node.js**: `v18.0.0` o superior
- **Gestor de paquetes**: `pnpm` (recomendado), `npm` o `yarn`

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/tu-usuario/auth-frontend.git
cd auth-frontend
pnpm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente variable:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Flujo de Autenticación y Seguridad

1. **Login Estándar**: El usuario envía credenciales (`username/email` + `password`).
2. **Desvío 2FA**: Si el usuario tiene 2FA activo, la API responde con un `ticket` temporal y el usuario es redirigido a `/verify-2fa`.
3. **Validación de Ticket & Token**: Una vez ingresado el código PIN de 6 dígitos correcto, la API retorna el **Bearer Access Token** JWT.
4. **Persistencia & Interceptores**: El token se almacena de forma segura y se adjunta automáticamente a los encabezados de autorización en cada petición HTTP mediante los interceptores de Axios en `src/lib/api/client.ts`.

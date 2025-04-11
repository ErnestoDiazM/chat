### Sistema de Chat en Tiempo Real

Un sistema de chat en tiempo real construido con Node.js, Express, y Socket.IO.

## Características

- Chat en tiempo real con Socket.IO
- Interfaz de usuario intuitiva
- Lista de usuarios conectados
- Notificaciones de conexión/desconexión
- Diseño responsivo

## Requisitos

- Node.js 14.0 o superior
- npm o yarn

## Instalación Local

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   npm install
   ```
3. Iniciar el servidor:
   ```
   npm start
   ```
4. Abrir en el navegador: `http://localhost:3000`

## Despliegue en Render.com

Este proyecto está configurado para ser desplegado fácilmente en [Render.com](https://render.com/).

### Pasos para el Despliegue

1. Crea una cuenta en [Render.com](https://render.com/) si aún no tienes una.

2. Desde el Dashboard de Render, haz clic en "New" y selecciona "Web Service".

3. Conecta tu repositorio de GitHub (asegúrate de que el código esté en GitHub).

4. Configura el servicio web con los siguientes valores:
   - **Name**: Nombre para tu aplicación (ej. "chat-app")
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. En la sección "Advanced", añade las siguientes variables de entorno:
   - `NODE_ENV`: `production`

6. Haz clic en "Create Web Service" para iniciar el despliegue.

7. Render automáticamente desplegará tu aplicación y te proporcionará una URL cuando esté lista.

### Consideraciones Importantes

- La aplicación está configurada para usar CORS en producción, permitiendo conexiones desde cualquier origen.
- El puerto se configura automáticamente en Render mediante la variable de entorno `PORT`.
- La aplicación está optimizada para funcionar en un entorno de producción con configuraciones específicas.

## Estructura del Proyecto

```
├── public/            # Archivos estáticos
│   ├── index.html     # Página principal
│   ├── main.js        # JavaScript del cliente
│   └── styles.css     # Estilos CSS
├── server.js          # Servidor Node.js
├── package.json       # Dependencias y scripts
└── README.md          # Documentación
```

## Licencia

MIT

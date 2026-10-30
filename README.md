# Centro I.A. — prototipo limpio

Esta carpeta contiene únicamente los archivos que utiliza la versión activa del prototipo. Los módulos y estilos de versiones anteriores se dejaron fuera de esta copia para evitar confusiones; el ZIP original permanece sin modificar.

## Abrir el proyecto

1. Descomprime el ZIP.
2. Abre la carpeta `Centro-IA` en Visual Studio Code.
3. Inicia un servidor estático (por ejemplo, la extensión Live Server) y abre `index.html`.

También puedes iniciar un servidor desde esta carpeta con:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000`.

## Estructura

```text
Centro-IA/
├── index.html
├── manifest.webmanifest
├── README.md
└── assets/
    ├── css/
    │   ├── nexo-club.css
    │   ├── cia-microdetalles-animaciones.css
    │   └── onboarding-polish.css
    ├── js/
    │   ├── nexo-club.js
    │   └── cia-microdetalles-animaciones.js
    ├── icons/
    │   ├── nexo-club.svg
    │   ├── nexo-club-192.png
    │   └── nexo-club-512.png
    ├── nexo-rosas-fondo.jpg
    └── nexo-fondo-ondas.png
```

## Cuentas y modos

- **Empresa:** inicia en el panel de negocio y puede cambiar a la vista Usuario para probar la experiencia de cliente.
- **Usuario:** inicia en la experiencia de cliente y no puede activar el panel de Empresa.
- Cerrar sesión permite volver a la pantalla de acceso.

## Guardado y límites

Este proyecto sigue siendo un prototipo local, no un servicio listo para producción.

- Los cambios se mantienen en memoria durante la sesión.
- El botón **Guardar demo** conserva una copia del estado en `localStorage` de ese navegador.
- No hay autenticación real, servidor, base de datos multiempresa ni protección de contraseñas. Las cuentas son demostrativas; no uses contraseñas reales ni información privada.
- Eventos, puntos, recompensas, campañas e invitaciones son simulaciones. No se publican ni se envían a servicios externos.
- Las fuentes y algunas imágenes remotas necesitan conexión a internet.

Para reiniciar los datos guardados de la demo, elimina la clave `nexoClubPrototype_demo_v3` desde el almacenamiento local del navegador.

## Archivos cargados por la aplicación

`index.html` carga tres hojas de estilo y dos scripts. Los demás archivos históricos del ZIP original no forman parte de esta versión activa y no se copian aquí.

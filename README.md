# Centro I.A. — Un motivo para volver

**Portada comercial rediseñada + demo interactiva de fidelización + backend de desarrollo.** Diseño propio de Centro I.A. con inspiración general en las páginas modernas de plataformas de fidelización y marketing. No es el sitio oficial de Leal 360 ni utiliza sus logotipos o fotografías.

## Qué aparece al entrar a GitHub Pages

- **`index.html`**: nueva página principal de Centro I.A., con encabezado blanco, gran sección oscura con ilustración original, botones dorados, presentación de funciones, proceso de uso, sección de IA en desarrollo y preguntas frecuentes.
- **`dashboard.html`**: aplicación interactiva que ya existía, con CSS, JavaScript, modo Cliente y modo Empresa, puntos, premios, reservas y estadísticas simuladas; conserva el fondo dorado animado.
- **`home.css` y `home.js`**: diseño, adaptación móvil y menú de la página principal.
- **`styles.css`, `app.js`, `waves.css`**: interfaz, funciones y animación de la aplicación de fidelidad, preservadas.
- **`assets/escena-comercio.svg`**: ilustración cinematográfica original de comercio, almacenada localmente; no es una fotografía tomada de Leal.

> **Transparencia**: la vista pública GitHub Pages continúa siendo una **demo local**, con empresas, puntos, cupones y estadísticas de ejemplo guardados en el navegador. No procesa pagos ni envía mensajes. El backend Node.js+SQLite incluido sigue separado de la interfaz nueva y requiere integración para una plataforma multiusuario por internet.

## Subir a GitHub

1. Descomprime el ZIP y sube **todo su contenido** a la raíz de tu repositorio GitHub, manteniendo los nombres y las carpetas. No subas el archivo ZIP como único archivo.
2. Comprueba que los archivos `index.html`, `dashboard.html`, `home.css`, `home.js`, `styles.css`, `app.js`, `waves.css`, `package.json` y la carpeta `.github/workflows` estén en la raíz.
3. En **Settings > Pages > Build and deployment**, selecciona **GitHub Actions**.
4. Al terminar el workflow de la rama `main`, abre la dirección `https://USUARIO.github.io/REPOSITORIO/`. **Mostrará la nueva portada**, no el README.
5. Haz clic en **Explorar demo** para abrir la app en `dashboard.html`.

### Probarla localmente

- **Vista pública**: desde la carpeta ejecuta `python -m http.server 8080` y entra a `http://localhost:8080/`. La app se abre en `http://localhost:8080/dashboard.html`.
- **Con Node.js 22.13+**: `npm run verify` comprueba el paquete y ejecuta las pruebas. `npm run build:pages` construye `dist/` para GitHub Pages.
- **Backend anterior**: `npm start` en `http://localhost:3000/` abre la interfaz multiusuario anterior, que utiliza Node.js + SQLite. Su servidor mantiene la ruta `/preview/` para la nueva portada y `/preview/dashboard.html` para la demo visual renovada.
- **Versión original de la app**: `http://localhost:3000/demo/`.

## Estructura de archivos

```text
index.html              Nueva página principal de Centro I.A.
home.css                Estilos de la portada
home.js                 Menú adaptable, accesibilidad
dashboard.html          App de fidelización previa (conservada)
styles.css              CSS de la app de fidelización
app.js                  JavaScript de la app de fidelización
waves.css               Fondo de ondas doradas animadas
assets/                 Recursos e ilustración original
app/                    Interfaz anterior conectada al servidor
server/                 Backend Node.js con SQLite
sql/                    Migraciones de base de datos
demo/                   Demo original anterior
.github/workflows/      Publicación GitHub Pages y pruebas CI
tests/                  Pruebas automáticas
scripts/                Construcción y verificaciones
```

## Antes de publicar como producto real

La página de marketing es funcional como sitio web, pero no hay agenda comercial ni formularios que envíen datos reales. No inventa logos de empresas clientes, cifras de negocio verificadas ni testimonios. Para ofrecer servicio real se requieren infraestructura, integración de la nueva interfaz con el backend, cuentas verificadas, privacidad, seguridad, canales de campañas y pagos. Lee [PENDIENTES-PARA-PRODUCCION.md](PENDIENTES-PARA-PRODUCCION.md).

No subas archivos `.env`, bases SQLite, credenciales ni respaldos. Este paquete no los contiene.
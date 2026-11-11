# Subir Centro I.A. a GitHub y mostrar la aplicación

1. Descomprime el archivo ZIP.
2. En GitHub, crea un repositorio y sube **el contenido** de la carpeta descomprimida (no el ZIP, ni una carpeta exterior adicional). Comprueba que `index.html`, `app.js`, `styles.css`, `waves.css` y `assets/` aparecen en la raíz.
3. Abre **Settings → Pages** y selecciona **GitHub Actions** como origen del despliegue.
4. Ve a **Actions → Publicar Centro I.A. en GitHub Pages** y verifica que termina en verde.
5. Abre la URL pública que se muestra en la sección Pages. Allí aparecerá la demo visual con sus estilos y animación.

Si solo ves las instrucciones, seguramente estás en la pestaña **Code/README** de GitHub o subiste los archivos dentro de una subcarpeta. La app se abre desde la URL de **Pages**.

GitHub Pages **no ejecuta el backend Node.js**, por lo que la página pública usa datos ficticios locales. Para usuarios reales instala el servidor en otro hosting y conecta la nueva interfaz a su API. Mientras tanto, el servidor anterior se mantiene disponible en el repositorio para pruebas locales.
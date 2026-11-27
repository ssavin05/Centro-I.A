# Experiencia personal de Usuario · 3.5

Modo Operate. Extensión del mundo Centro I.A. aprobado. La prioridad es la persona que visita negocios, con azul noche/profundo, cielo, blanco y dorado. El modo Empresa conserva su composición.

## Propósito y verdad

Relacionar el saldo de cada negocio con un premio concreto, una próxima visita y el reconocimiento de visitas confirmadas. Sin saldo combinado, premios inventados, rachas ficticias ni seguimiento pasivo. Las acciones existentes y sus confirmaciones del servidor permanecen como frontera de escritura.

## Primer viewport

Saludo existente, selector de lugares y premio elegido. Bloque principal azul noche con nombre real, puntos y avance dorado; acción de canje o consulta. Bloque de siguiente encuentro en azul claro. Móvil apila y conserva las acciones principales antes de la actividad secundaria. No se crea una portada comercial dentro de la aplicación.

## Interacción y movimiento

Momento focal: al elegir negocio o premio se descubre la nueva meta mediante clip y aparece su avance real. Una variación positiva del saldo solo se reconoce después de recibir el nuevo snapshot de la misma identidad. La primera carga no se presenta como ganancia. Navegación y pulsaciones conservan feedback breve; no hay bucles, sonidos ni retrasos de acceso. Se cancelan animaciones interrumpidas y se omite movimiento con reduced-motion o pestaña oculta.

## Alcance de componentes

Inicio personal con meta, siguiente cita/canje/llegada, progreso de nivel/reto, promociones vigentes y actividad. Premios con filtros, progreso y acceso a ver una meta. Los datos proceden de los snapshots existentes; no hay migraciones ni nuevas dependencias. Empresa y permisos permanecen separados.

## Implementación y evidencia 3.5

Fuentes contrastadas: `customer.css`, `customer-ui.js`, `customer-rules.js`, integración en `loyalty-ui.js`, `studio-ui.js` y `workspace.html`. La meta y el siguiente paso usan dos columnas y se apilan hasta 760px; hasta 600px la acción dorada ocupa todo el ancho del bloque focal. Los selectores de negocio y promociones desplazan dentro de su región con barra fina visible, azul sobre azul claro. El siguiente paso prioriza canje pendiente de recoger, cita futura y llegada/salida voluntaria; la recogida usa crema dorada.

El inicio conserva tres accesos personales, pases existentes, nivel por visitas confirmadas, hasta dos retos activos, hasta tres promociones vigentes y cuatro movimientos recientes del negocio elegido. Sin programas se ofrece explicación y acceso a Explorar; sin premio disponible se conserva el saldo con estado explícito. Premios añade filtros Todos, Puedo canjear y Por alcanzar, selector de negocio y progreso accesible. Ver mi avance elige temporalmente esa meta y vuelve al inicio. Selección, filtros y metas viven en memoria y se limpian por identidad.

La entrada de meta dura 280ms y la de avance 440ms. El aviso textual de incremento dura hasta ocho segundos y requiere un snapshot posterior de la misma identidad y negocio; no celebra la primera carga. El nivel reconoce visitas y no concede beneficios adicionales. Los iconos son SVG; la tipografía y los controladores de escritura se conservan.

Evidencia del 25 de noviembre de 2026, toda en PRUEBA LOCAL:

- `.impeccable/review/v35/desktop-home.jpg`: 1425 × 866px, inicio personal en escritorio.
- `.impeccable/review/v35/mobile-home.jpg`: 375 × 812px, inicio personal apilado.
- `.impeccable/review/v35/tablet-rewards.jpg`: 753 × 858px, premios y filtros en tablet.

El revisor fresco puntuó resuelta la única corrección solicitada: barra de desplazamiento móvil visible y coherente con la paleta. Disposición SHIP limitada a esa corrección; las otras capturas muestreadas no requirieron ajustes adicionales. El lote completo reportó 104 pruebas y build correctos. Esto no acredita todos los formularios, auditoría WCAG, hardware físico, concurrencia entre conexiones ni recorrido integral en producción.

Frontend 3.5 local, sin publicación acreditada y sin migraciones nuevas. El detector Impeccable no estuvo disponible por caché restringida con engine 0.1.5; no se declara ejecutado. El frontmatter aprobado y `.impeccable/design.json` se conservan. Las variantes locales, el display heredado con familia de sistema y el drift previo no se promueven a nuevas reglas ni se reparan en esta extensión.

## Barra de calidad

Contraste, etiquetas, foco, controles de44px, composición1440/768/390 y estado vacío. Confirmaciones reales para toda escritura, escape de datos, identidad limpia al salir y objetivos seleccionados solo en memoria. Verificación de reglas derivadas y recorridos de navegador; revisión independiente limitada a evidencia capturada. No declarar activación/publicación o auditoría integral por cambios visuales.

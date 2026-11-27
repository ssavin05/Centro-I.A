# Interior de fidelidad · Centro I.A.

Modo: Operate. Rediseño completo del antiguo perfil vacío dentro de la identidad aprobada: dorados, azules claro/profundo, negro y blanco.

Propósito: el Usuario encuentra sus negocios y premios, registra llegada/salida y canjea sus puntos. Empresa crea un programa y premios, confirma visitas reales, ve clientes y entrega canjes. La cuenta mantiene su tipo inmutable.

Primer viewport: navegación propia estable, saludo, ticket de regreso azul profundo con acción dorada; indicadores reales y acceso a negocios/actividad. Escritorio usa barra lateral; celular usa navegación inferior. Tablet usa iconos.

Interacción principal: llegada voluntaria → confirmación Empresa → puntos por negocio → canje atómico → entrega confirmada. Una llegada cada 18 horas; jamás geolocalización pasiva. El canje usa diálogo nativo de confirmación.

Estados: carga, error recuperable, datos vacíos, módulo sin activar y datos reales del entorno. Sin números inventados. La prueba local siempre se identifica como PRUEBA LOCAL y no comparte cuentas ni datos con Supabase.

Contrato técnico: HTML/CSS/ES Modules, RPC Supabase, RLS y transacciones. Base de prueba persistente PostgreSQL 17.5/PGlite, aislada fuera del repositorio. Presupuesto cero. Migración aplicada tras autorización explícita posterior al bloqueo inicial de auto-review; permisos/RLS comprobados sin fixtures de producción.

Calidad: controles de 44px, foco visible, texto contrastado, búsqueda/filtrado, escape de datos dinámicos y limpieza por cambio de identidad. Movimiento reservado para feedback y confirmaciones; reducción de movimiento.

Evidencia: .impeccable/review/interior. Capturas de viewport; fullPage no funcionó en el navegador de esta sesión. Recorrido completo y persistencia comprobados en navegador. No es auditoría WCAG completa ni certificación de concurrencia PostgreSQL entre conexiones independientes.

Revisión final: se resolvieron los nombres accesibles de tablet (marca, navegación y logout) y el tono/anuncio de errores de mutación. El revisor puntuó ambos fixes resolved, con disposición ship limitada a ese alcance. No certifica auditoría integral.


## Extensión 3.2

Modo Operate y mundo existente preservados. La paleta profundiza el azul noche #102a43, superficies #e1eef7 y acento #edc77d con cuatro variantes de negocio. Wizard de cuatro etapas, catálogo por giro con importación revisable, logo propio, agenda por recurso, promociones, retos y notificaciones privadas. En <=420px la agenda usa selector nativo diario para evitar recortar siete columnas. Entrada/salida breve de paneles y celebración finita solo de operaciones confirmadas; reduced-motion. Documentos extraídos localmente, originales no adjuntos. Todos los ejemplos capturados están marcados PRUEBA LOCAL. Alcance original 3.2: una empresa propietaria/un programa, recursos textuales, sin empleados/sucursales, push, OCR o POS. Evidencia v32 en .impeccable/review/v32; revisión independiente requiere restaurar foco y controles importados de 44px.

Cierre 3.2: revisor independiente puntuó los dos fixes de foco y controles importados 44px como resolved; disposition ship limitada al lote, sin auditoría integral. Siete recapturas válidas y evidencia DOM de teclado. Documentación DESIGN.md/sidecar actualizada, drift antiguo conservado.

Estado de Studio al 25 de noviembre de 2026: migración `20261125154520_studio_32.sql` aplicada en Supabase; inventario remoto de 14 tablas `cia_*` con RLS y 11 RPC Studio restringidas a usuarios autenticados, con `search_path` vacío. La aplicación del esquema no acredita publicación del frontend ni un recorrido integral en producción.

## Extensión de operación 3.3

Modo Operate: extensión del interior aprobado, con su azul profundo, dorado, tablas planas y navegación existente. Sedes, equipo y recursos añaden contexto operativo al programa de fidelidad. El selector de sede muestra la función efectiva y su zona horaria. Los botones de sección dependen de permisos; la reserva de un cliente no lo convierte en personal. La navegación dice Equipo y sedes, Mi trabajo o Reservar según el acceso y permanece en Más en celular.

Agenda diaria con inicio/fin, recurso y estados textuales. Solicitar cita consulta horarios disponibles antes de elegir un slot; la selección usa dorado y foco visible. Equipo y recursos conservan tablas con desplazamiento interno; nombre del recurso y metadatos se separan en líneas distintas. En celular, contexto y barra de fecha/acción se apilan; la cuadrícula de horas usa dos columnas. Recursos, horarios semanales, descansos y ausencias son entidades de 3.3, distintas de los nombres manuales de la agenda original 3.2. Las citas no conceden puntos automáticamente.

Fuentes contrastadas: `operations-ui.js`, `operations-rules.js`, `operations.css`, `loyalty-ui.js`, `studio-ui.js` y `workspace.html`. El editor enfoca su primer campo y restaura el foco al cerrar o guardar. El guardado de horarios con respuesta `void` fue verificado: muestra confirmación, cierra el formulario y restaura el foco. Los errores conservan entradas. La reducción de movimiento de Studio también abarca el panel de operación; su controlador omite la transición cuando la preferencia está activada.

Evidencia visual válida del 25 de noviembre de 2026, toda en PRUEBA LOCAL:

- `.impeccable/review/v33/desktop-resources.jpg`: escritorio de 1440px, propietario, Recursos y horarios; nombre y metadatos del recurso separados.
- `.impeccable/review/v33/tablet-professional.jpg`: tablet de 768px, Profesional, contexto de sede, secciones permitidas y agenda vacía.
- `.impeccable/review/v33/mobile-agenda.jpg`: celular de 390px, cliente, sede/función/zona, Agenda, fecha y Solicitar cita; navegación inferior conserva Más.

Un revisor independiente fresco emitió SHIP limitado a estas tres vistas después de recapturarlas y separar los metadatos del recurso. Este dictamen no certifica todos los formularios, accesibilidad integral, concurrencia entre conexiones ni producción. El detector Impeccable no estuvo disponible por la caché restringida; no se declara ejecutado. El frontmatter aprobado y `.impeccable/design.json` se conservan; el drift previo no se repara en esta extensión.

Estado de entrega actualizado al 25 de noviembre de 2026: Operations 3.3 y su hardening quedaron activados en Supabase con la versión `20261125201303`. El inventario remoto comprobado registra 21 tablas con RLS, 13 RPC de Operations restringidas a usuarios autenticados, cero programas y dos perfiles. La vista de prueba de 3.3 usa `scripts/start-33.mjs`, puerto 4176, y cinco identidades aisladas; su selector no equivale a autenticación. No se crearon fixtures de producción ni una publicación nueva de Pages o main. La activación del esquema no acredita un recorrido integral del frontend en producción.

## Extensión de actividad y datos 3.4

Modo Operate, mismo mundo y tokens. Fuentes contrastadas: `growth-ui.js`, `growth-rules.js`, `growth.css`, `pwa.js`, `sw.js` y `offline.html`. El panel Actividad y datos se alcanza desde navegación, Más en celular y Cuenta; sus secciones dependen del tipo de cuenta. Historial reúne búsqueda por registro, negocio y texto con cursor Anterior/Siguiente y descarga completa en CSV. Las tablas mantienen desplazamiento propio. Las fechas del historial usan la zona del dispositivo; las estadísticas de retorno agrupan el detalle diario por UTC.

El formulario de búsqueda usa cuatro columnas, dos hasta 1000px y una hasta 600px; la descarga se apila en celular y la paginación envuelve. Retorno de clientes muestra seis métricas reales de los últimos 30 días en tres columnas, reducidas a dos hasta 1000px. Se explican visitas confirmadas y canjes sin cancelar. Los estados de carga, vacío, error y ampliación sin activar son explícitos; el cambio de identidad limpia datos y consultas, y detiene exportaciones anteriores.

La Empresa puede cancelar un canje pendiente y devolver puntos con motivo obligatorio. Abrir el editor enfoca el motivo; Volver cierra sin enviar, y la respuesta confirmada cierra el formulario y enfoca el título de actividad. Un fallo conserva entradas. Mis programas permite confirmar una salida reversible que conserva puntos e historial y volver a participar; llegadas abiertas, premios pendientes y próximas citas impiden salir. Avisos conserva mensajes operativos y permite elegir campañas promocionales internas, sin activar canales externos ni push. Las citas ofrecen ICS individual para importación manual.

La preparación PWA muestra instrucciones desde Cuenta y expone el botón de instalación solo si el navegador la ofrece. El aviso de desconexión explica que no se guardan envíos para después. La pantalla offline contiene marca, explicación y vuelta al inicio; no contiene una copia privada de la cuenta. `sw.js` limita la caché a recursos públicos enumerados y mantiene autenticación, RPC y páginas privadas en red; no se registra en PRUEBA LOCAL.

Evidencia visual válida del 25 de noviembre de 2026, toda en PRUEBA LOCAL. Los anchos objetivo fueron 1440/768/390px; las dimensiones reales de imagen son las del viewport capturable sin chrome:

- `.impeccable/review/v34/desktop-history.jpg`: 1425 × 866px, Empresa, Historial y registros de canjes con acciones y exportación.
- `.impeccable/review/v34/tablet-insights.jpg`: 753 × 858px, Empresa, Retorno de clientes con seis métricas y detalle diario.
- `.impeccable/review/v34/mobile-memberships.jpg`: 375 × 812px, Usuario, Mis programas con participación reversible y navegación inferior.

Un revisor independiente fresco emitió SHIP limitado a estas tres vistas, sin fixes materiales. El recorrido en navegador verificó cancelación de canje con motivo y foco, rechazo de salida por cita futura con alerta y estado de CSV descargado. El lote completo reportó 98/98 pruebas aprobadas. Esta evidencia no acredita instalación PWA, auditoría WCAG, todos los formularios, concurrencia entre conexiones ni recorrido integral en producción.

Estado de entrega: Growth 3.4 permanece SOLO LOCAL, sin migración aplicada al remoto y sin fixtures de producción. Operations 3.3 ya está activado; su estado no implica activación de Growth. El loader y el detector Impeccable no pudieron habilitarse por la caché restringida; las referencias se leyeron manualmente y no se declara ejecución de esas herramientas. El frontmatter de DESIGN.md y `.impeccable/design.json` se conservan sin nuevos tokens; el drift previo permanece sin reparar.

## Experiencia personal de Usuario 3.5

Modo Operate, extensión del mismo mundo y sin nuevos tokens. `customer.css`, `customer-ui.js` y `customer-rules.js` se integran mediante `loyalty-ui.js`, `studio-ui.js` y `workspace.html`. El contrato detallado está en `.impeccable/surfaces/customer.md`. Usuario abre con negocio elegido, premio concreto, saldo y progreso reales en azul noche/océano con acción dorada; el siguiente paso usa cielo o crema de recogida. Prioriza canje pendiente, cita futura y llegada/salida voluntaria. La composición se apila hasta 760px y conserva accesos a premios, citas y explorar; Empresa mantiene su vista.

Nivel, retos, promociones vigentes y cuatro movimientos recientes pertenecen al negocio elegido. Premios añade filtros por puntos y negocio, progreso accesible y elección temporal de una meta. Selección y filtros se limpian por identidad. La entrada de meta de 280ms y avance de 440ms es finita; no se anima la primera carga como ganancia. El incremento requiere un snapshot posterior de la misma identidad y negocio. Se cancela movimiento previo y se omite con pestaña oculta o reduced-motion. Sin programas o premios disponibles se explica el estado.

Evidencia local v35: `desktop-home.jpg` (1425 × 866px), `mobile-home.jpg` (375 × 812px) y `tablet-rewards.jpg` (753 × 858px), todas en `.impeccable/review/v35/` y PRUEBA LOCAL. El revisor fresco puntuó resuelta la única corrección de barra de desplazamiento móvil y emitió SHIP limitado a ese arreglo; las otras vistas muestreadas no requirieron más ajustes. El lote reportó 104 pruebas y build correctos. No certifica todos los formularios, auditoría integral ni producción.

3.5 no añade migraciones y el frontend permanece local, sin publicación acreditada. Detector no disponible por caché restringida con engine 0.1.5; no se declara ejecutado. Frontmatter y `.impeccable/design.json` conservados; drift anterior y display de sistema heredado no reparados ni canonizados.

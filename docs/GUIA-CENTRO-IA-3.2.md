# Centro I.A. 3.2 — Guía de funciones y uso

Esta guía sirve al dueño del proyecto y a quienes prueban los modos Usuario y Empresa. Explica qué puedes hacer, dónde hacerlo y qué falta para abrir el servicio al público. Corte de la entrega: 16 de noviembre de 2026, hora del Pacífico.

**Estado de esta entrega:** aplicación funcional en prueba local persistente. Los módulos 3.2 tienen código, migración y pruebas locales. Su migración nueva todavía no está aplicada a Supabase de producción. El núcleo anterior de fidelidad sí fue aplicado después de tu autorización. Un ZIP, una prueba local y una publicación para clientes son etapas distintas.

## 1. Empieza aquí

Extrae el ZIP completo antes de abrir sus archivos. Lee LEEME.html y esta guía. La carpeta fuente contiene el código editable; sitio-publicable contiene únicamente el frontend construido.

Requisitos para ejecutar la prueba local: Windows con Node.js 22.13 o posterior y acceso a Internet para instalar dependencias la primera vez. La comprobación de esta entrega usa Node 24.22.1 y pnpm 11.25.0.

1. Si no tienes dependencias instaladas, ejecuta INSTALAR-DEPENDENCIAS.bat. Instala las versiones del archivo pnpm-lock.yaml con los scripts de instalación desactivados.
2. Ejecuta INICIAR-Cia.IA.3.2.bat y conserva abierta la ventana.
3. Abre http://127.0.0.1:4175/workspace.html?as=company para Empresa.
4. Abre http://127.0.0.1:4175/workspace.html?as=user para Usuario.
5. Comprueba que aparece la franja PRUEBA LOCAL. Los cambios permanecen al recargar y reiniciar.

La prueba crea dos identidades ficticias locales y empieza sin negocios nuevos. El selector Usuario/Empresa solo existe en esa prueba. No inicia sesión en tus cuentas reales, no envía correos y no se conecta a Supabase. Si ya hay datos de una prueba anterior en este equipo, los conserva. No compartas este servidor local como aplicación pública.

También puedes ejecutar desde fuente: `node scripts/start-32.mjs`. Para detenerlo, usa Ctrl+C. Si el puerto está ocupado, usa la instancia abierta o establece PORT con otro puerto. La base local se guarda en la carpeta .local-centro-fidelidad junto a fuente y queda fuera del sitio publicable y del ZIP original.

## 2. Cuadro de funciones: Usuario y Empresa

En esta tabla, “implementado” describe el código y la prueba local de esta entrega. No significa activación pública de los módulos 3.2.

| Función | Usuario | Empresa | Cómo funciona / límite |
|---|---|---|---|
| Registro y acceso oficial | Elige cuenta Usuario | Elige cuenta Empresa | Supabase Auth y perfil protegido; correo y recuperación real requieren validación operativa |
| Inicio personal | Ve negocios, puntos y actividad propia | Ve clientes, visitas y entregas de su programa | Indicadores calculados con los registros disponibles |
| Explorar negocios | Busca programas publicados y se une | Decide publicar o dejar privado su programa | Publicar requiere pulsar la acción correspondiente |
| Código de invitación | Se une con el código del negocio | Comparte su código | La unión repetida no duplica membresía |
| Cuenta y nombre | Edita su nombre | Edita su nombre de cuenta | El tipo de cuenta no se cambia desde el perfil |
| Descargar perfil | Descarga los campos guardados del perfil | Igual | No es una exportación completa de toda la actividad comercial |
| Creación de negocio | No administra negocios | Asistente de cuatro pasos | Un propietario y un programa por cuenta Empresa en esta versión |
| Giro y forma de trabajo | Encuentra la oferta adaptada de cada negocio | Selecciona entre ocho giros y cuatro formas de trabajo | Cambia etiquetas, catálogo, recurso y orientación de premios |
| Datos del negocio | Consulta el contexto de sus negocios | Edita nombre, categoría, ciudad, descripción, contacto y horarios | Los horarios se describen en texto; no generan disponibilidad automática |
| Tema de marca | Ve la identidad del negocio en su oferta | Elige cuatro variantes de azules y dorados | Mantiene la identidad Centro I.A.; no es un editor libre de colores |
| Logo propio | Lo ve en el catálogo de sus negocios | Sube, cambia o quita su logo después de crear | PNG/JPG/WEBP; se adapta localmente antes de guardar |
| Catálogo o menú | Consulta productos, servicios, precios y categorías | Crea y edita elementos y los pausa | Catálogo informativo; no procesa órdenes ni pagos |
| Importación de documentos | No modifica el menú de una empresa | Selecciona archivo, revisa filas y guarda | Ocho extensiones; extracción aproximada en PDF/texto |
| Exportación CSV | No exporta catálogos ajenos desde esta pantalla | Descarga su catálogo base | Incluye nombre, descripción, categoría, precio, moneda, tipo y duración |
| Llegada voluntaria | Registra Estoy aquí | Ve solicitudes de sus clientes | No hay geolocalización ni detección pasiva |
| Salida voluntaria | Registra su salida | Puede registrar la salida de una visita | Muestra solo lo que se registró; no sabe si alguien olvidó marcar salida |
| Confirmación de visita | Espera validación | Confirma la visita real | Solo entonces se abonan puntos por negocio |
| Límite de visitas | Consulta próxima llegada disponible | Consulta historial | Se conserva la separación mínima de 18 horas entre llegadas |
| Saldo de puntos | Ve un saldo distinto por negocio | Ve saldo de cada cliente de su programa | No se mezclan puntos entre empresas |
| Ajuste de puntos | Recibe aviso y movimiento | Añade o descuenta con motivo | Transacción autorizada; rechaza saldo negativo y evita duplicar un envío |
| Historial de puntos | Ve movimientos propios | Ve movimientos de su programa | Visitas, canjes, bonos y ajustes nuevos; las operaciones anteriores conservan su historial original |
| Tipos de recompensa | Canjea producto, descuento, servicio, experiencia o regalo | Crea y edita cada tipo | Tipo y condiciones describen la entrega; no representan dinero en una cartera |
| Condiciones y vencimiento | Consulta condiciones antes de elegir | Define coste, stock, condiciones y vigencia | Un premio vencido o sin stock no admite nuevos canjes |
| Canje de premio | Confirma antes de gastar puntos | Consulta canjes por entregar | Saldo y stock se actualizan en una misma transacción |
| Entrega de premio | Consulta comprobante y estado | Confirma la entrega | La repetición de la misma operación no vuelve a descontar puntos |
| Promociones | Ve promociones vigentes de sus negocios | Crea descuentos, paquetes, especiales y novedades | Fechas y condiciones; el negocio aplica la oferta al atender |
| Retos de visitas | Sigue avance y solicita su bono | Define visitas requeridas, fechas y puntos extra | Cuenta visitas confirmadas dentro del periodo; un bono por persona y reto |
| Niveles de fidelidad | Explorador, Habitual y Preferente por negocio | Consulta el nivel de sus clientes | Reconocimiento visual de actividad; no cambia permisos |
| Calendario | Consulta sus citas y solicita un horario | Consulta clientes, recursos y fechas | Vista mensual o selector diario compacto en celulares pequeños |
| Solicitud de cita | Elige negocio, servicio, inicio y fin | Recibe solicitud pendiente | Solicitar no garantiza disponibilidad hasta la confirmación |
| Cita manual y bloqueo | Ve las citas que le asignan | Crea cita para cliente o bloqueo interno | El bloqueo no genera cliente ficticio ni aviso a una persona inexistente |
| Estados de cita | Puede cancelar su cita pendiente/confirmada | Confirma, completa o cancela | Las citas completadas/canceladas son terminales; no se borran desde la pantalla |
| Separación de horarios | Ve sus propios horarios | Filtra por recurso | Impide superponer citas confirmadas del mismo recurso; no administra turnos laborales completos |
| Avisos internos | Recibe avisos de puntos, retos, citas y premios | Recibe solicitudes pertinentes | Bandeja privada con contador y marca de lectura |
| Movimiento y estímulos | Transiciones y celebración breve de acciones confirmadas | Feedback de operaciones | Sin puntos inventados ni celebraciones de fallos; respeta movimiento reducido |
| Móvil y tablet | Navegación inferior y Más | Mismos accesos adaptados al rol | Escritorio lateral, tablet compacta y móvil con controles táctiles |
| Actualización de datos | Pulsa Actualizar | Pulsa Actualizar | No hay actualización permanente en tiempo real ni push de fondo |
| Cerrar sesión oficial | Disponible desde su cuenta/navegación | Igual | Limpia datos privados de la vista; la prueba local no representa una sesión Auth real |

## 3. Tipos de cuenta y niveles

**Usuario** es la persona que visita negocios, acumula puntos, consulta beneficios y solicita atención. Puede pertenecer a varios programas y mantiene un saldo separado en cada uno.

**Empresa** es el propietario del programa. Administra su negocio, catálogo, premios, promociones, clientes y agenda. No puede acceder a los datos internos de otra empresa.

**Explorador** corresponde a menos de tres visitas confirmadas; **Habitual**, de tres a nueve; **Preferente**, a partir de diez. Estos niveles son por negocio. No prometen descuentos automáticos ni habilitan pantallas administrativas.

No existen todavía cuentas separadas de cajero, recepcionista, gerente de sucursal, administrador de organización o superadministrador de plataforma. Elegir “Organización” en el asistente no crea esos permisos.

## 4. Personalización según el negocio

| Giro | Catálogo | Calendario y recurso | Premio apropiado que tú puedes crear |
|---|---|---|---|
| Peluquería y belleza | Servicios con duración | Agenda de citas; profesional o silla | Tratamiento, servicio complementario o descuento |
| Restaurante y cafetería | Menú de alimentos y bebidas | Reservas; mesa o zona | Bebida, postre, paquete o degustación |
| Comercio y tienda | Productos y colecciones | Atención; mostrador o asesor | Producto, descuento o acceso a una colección |
| Bienestar | Tratamientos y sesiones | Agenda de sesiones; cabina o especialista | Sesión extra o complemento |
| Gimnasio y actividad | Clases y servicios | Calendario de clases; sala o entrenador | Clase especial o sesión personalizada |
| Servicios profesionales | Consultas y asesorías | Agenda de atención; asesor o área | Servicio adicional o beneficio por continuidad |
| Organización y administración | Servicios y beneficios | Calendario de atención; sede, área o responsable | Beneficio o reconocimiento de participación |
| Otro negocio | Catálogo personalizado | Calendario; área de atención | Producto, servicio, regalo o experiencia |

Las formas de trabajo son Independiente, Negocio con equipo pequeño, Atención en varias áreas y Organización o administración. En 3.2 describen y personalizan el programa. No son un sistema de sucursales, nómina, permisos laborales ni ERP.

### Crear y configurar la empresa

1. Entra como Empresa y abre Mi negocio. En móvil abre Más y después Negocios.
2. Elige actividad y forma de trabajo.
3. Completa nombre, categoría y ciudad. Añade descripción, teléfono, referencia y tema.
4. Define los puntos por visita confirmada, si recibes solicitudes de cita, zona y horarios.
5. Revisa el resumen y pulsa Crear mi programa o Guardar configuración.
6. Comprueba la confirmación. Aparecen el código de invitación y la zona para subir logo.
7. Crea tu catálogo y primer premio antes de invitar clientes.
8. Si quieres aparecer en Explorar, pulsa Publicar en Explorar. Un programa nuevo comienza en privado.

Para editar, repite el asistente con los valores guardados. Cambiar los puntos por visita afecta las próximas confirmaciones, no reescribe automáticamente el historial. La configuración permite hasta 1.000 puntos por visita.

### Subir logo

Después de crear el programa, abre Mi negocio → Tu logo, tu firma. Elige PNG, JPG o WEBP de hasta 5 MB. La aplicación reduce la imagen a un máximo de 512 píxeles por lado y la convierte a WEBP; el contenido guardado tiene un límite adicional de tamaño. Comprueba la confirmación y la vista del logo. SVG y enlaces externos no se admiten en este flujo.

## 5. Crear, importar y modificar un menú

Para añadir manualmente, abre Servicios, Menú o Catálogo según el giro. Pulsa Añadir, completa nombre, categoría, tipo, precio, moneda, duración opcional y descripción. Guarda y confirma que aparece el elemento. Para modificarlo, pulsa Editar. “Pausado” lo retira de la oferta activa del cliente y conserva el registro.

La duración admite de 5 a 1.440 minutos. Las monedas son MXN, USD y EUR; no hay conversión automática entre ellas. Un precio de cero es válido si el negocio ofrece algo gratuito.

### Importación desde otra aplicación

1. Exporta tu menú desde la aplicación de origen a CSV, TSV, JSON, HTML, TXT, Markdown, DOCX o PDF con texto.
2. Pulsa Importar documento → Elegir documento.
3. Espera la lectura. Revisa nombres, categorías, precios, moneda, tipo y duración.
4. Corrige las filas marcadas o quítalas. Puedes omitir nombres que ya existen en la misma categoría.
5. Pulsa Guardar catálogo revisado.
6. Comprueba los elementos guardados. Usa Editar para completar o corregir descripciones y otros datos.

El archivo se interpreta en el navegador. No se envía a un servicio de IA ni se ejecuta su HTML. Al guardar, se transmiten las filas revisadas a la base del entorno elegido. El documento original no se conserva como archivo adjunto.

| Formato | Qué interpreta | Recomendación |
|---|---|---|
| CSV / TSV | Columnas con encabezados en español o inglés, comillas y separadores habituales | Preferible para trasladar muchos elementos |
| JSON | Lista o propiedad items, catalog, productos o servicios | Usa nombres de campos reconocibles y revisa moneda |
| HTML / HTM | Tablas o líneas de texto con precio | Exporta el contenido, no una página que necesite iniciar sesión |
| TXT / Markdown | Líneas con nombre seguido de precio | Evita diseños con varias columnas |
| DOCX | Tablas o párrafos de texto | El formato antiguo .doc no es compatible |
| PDF con texto | Agrupa texto por línea y busca nombre y precio | Revisa siempre; columnas complejas pueden perder asociaciones |
| Imagen / PDF escaneado | No hay OCR en esta entrega | Captura manualmente o exporta a CSV desde el origen |
| XLSX / archivos de una app propietaria | No se importan directamente | Exporta a CSV; no se promete compatibilidad universal |

Límites: archivo de hasta 10 MB, PDF de hasta 50 páginas y hasta 250 filas por lote de revisión. CSV con más de 1.000 filas se rechaza para que lo dividas; en otros casos un aviso indica si se muestran solo las primeras 250. El DOCX solo extrae su XML de texto compatible y tiene un límite de descompresión para ese contenido. Un PDF protegido necesita una copia sin contraseña. No se importan compras ni datos de clientes a través del menú.

## 6. Fidelidad, estímulos y recompensas

El recorrido principal es: unirse → registrar llegada → empresa confirma → sumar puntos → elegir recompensa → confirmar canje → empresa entrega.

La llegada y salida son voluntarias. Una visita pendiente no genera puntos. La confirmación registra el abono una sola vez. La separación de 18 horas evita repetir llegadas como si fueran visitas nuevas. No hay seguimiento automático del teléfono ni garantía de conocer una salida que nadie registró.

### Preparar premios

Abre Premios → Crear premio. Elige Producto, Descuento, Servicio, Experiencia o Regalo. Define puntos necesarios, unidades o disponibilidad sin límite, fecha final opcional, descripción y condiciones de entrega. Guarda. Puedes editar y pausar premios; los canjes anteriores conservan el nombre y coste registrados al canjear.

Los puntos no son dinero ni se transfieren entre negocios. Un descuento como recompensa describe un beneficio que el negocio entrega; la app no conecta todavía con la caja ni aplica importes a un cobro.

### Preparar promociones y retos

En Promociones, crea una oferta con tipo, título, fechas, estado y condiciones. El porcentaje solo se interpreta como porcentaje cuando eliges Descuento. La empresa aplica el beneficio al atender.

Un reto tiene nombre, periodo, número de visitas confirmadas y bono fijo. La persona ve su avance; al completarlo solicita el bono. La base comprueba las visitas del periodo y evita recibirlo dos veces. Los niveles acompañan el progreso con reconocimiento visual, sin alterar permisos ni inventar escasez.

### Ajustar puntos con motivo

Abre Clientes y puntos → Ajustar puntos. Escribe una cantidad positiva para añadir o negativa para descontar y un motivo de al menos tres caracteres. Confirma. Comprueba el saldo y el movimiento. El cliente recibe un aviso interno. Un ajuste que dejaría el saldo negativo se rechaza y conserva el formulario.

Los saldos preexistentes al módulo 3.2 se consideran saldo inicial; no se inventan movimientos individuales históricos para reconstruirlos.

## 7. Agenda y separaciones

La Empresa puede añadir una cita para un cliente unido al programa o un bloqueo sin cliente. El Usuario puede solicitar un horario si el negocio habilita solicitudes. Las solicitudes llegan “Por confirmar”.

1. Elige el día. En tablet/escritorio utiliza el mes; en celulares pequeños utiliza Elegir día.
2. Pulsa Solicitar cita o Añadir cita o bloqueo.
3. Selecciona negocio y servicio opcional; escribe título, inicio, fin y recurso.
4. Envía o guarda. El cliente espera confirmación del negocio.
5. La Empresa confirma, completa o cancela. El Usuario puede cancelar su propia cita pendiente o confirmada.
6. Comprueba el estado actualizado en la agenda y en las notificaciones.

Usa siempre el mismo nombre para el mismo recurso: por ejemplo, “Silla 1” o “Mesa 2”. El recurso es un nombre manual, no una cuenta de empleado. Las citas confirmadas del mismo recurso no pueden superponerse. Las solicitudes pendientes pueden coincidir y requieren decisión del negocio.

Las horas del formulario y de la agenda corresponden a la zona del dispositivo, indicada en pantalla. La zona guardada del negocio es información de configuración; no convierte toda la agenda a esa zona. Si reservas desde otra zona, confirma el horario con el negocio. Las citas pueden durar hasta 24 horas. Una cita completada no genera puntos por sí sola: la visita sigue su proceso de confirmación.

No hay reservas recurrentes, cupos de clases grupales, disponibilidad por turnos, vacaciones, recordatorios programados, sincronización con Google Calendar ni reprogramación de una cita existente. Para cambiar un horario en 3.2, cancela el registro activo y crea otro.

## 8. Notificaciones, colores y movimiento

La bandeja Notificaciones muestra avisos de ajustes, retos, citas, visitas confirmadas, canjes y entregas que se produzcan con el módulo activado. Los avisos son privados para su destinatario y pueden marcarse leídos. El contador se actualiza al recargar los datos. No se envían SMS, WhatsApp, correo ni push en segundo plano.

| Color | Uso principal |
|---|---|
| Azul noche #102A43 | Navegación, bloques principales y estructura |
| Azul océano #123E5B | Variante de identidad de negocio |
| Azul profundo #173C50 / #244D6A | Texto, controles y variantes |
| Azul claro #E1EEF7 / #DCEEFA | Fondos, superficies de apoyo y lectura |
| Dorado #EDC77D / #D9AF63 | Acción principal, selección, progreso y reconocimiento |
| Blanco #FFFFFF | Formularios y contenido |
| Negro azulado #0D151B | Texto y contraste de marca |

Las variantes combinan esos tonos en cuatro temas: Azul noche, Azul océano, Azul claro y Dorado profundo. Se mantiene el dorado como acento y los azules oscuros como base.

Al cambiar de sección hay salida breve y entrada suave. Las acciones confirmadas de visitas, citas y premios activan una celebración finita. La preferencia del dispositivo para reducir movimiento evita esas animaciones. No se retrasa el acceso para mostrar una animación ni se confunde un fallo con un éxito.

## 9. Qué contiene el ZIP

| Archivo o carpeta | Para qué sirve |
|---|---|
| LEEME.html | Entrada legible al paquete, instrucciones y enlaces |
| INICIAR-Cia.IA.3.2.bat | Inicia la prueba local en el puerto 4175 |
| INSTALAR-DEPENDENCIAS.bat | Instala las dependencias fijadas |
| fuente | Código, pruebas, migraciones, documentación y ejemplos editables |
| sitio-publicable | Frontend construido con lista explícita de archivos |
| capturas | Evidencia de la prueba local en varios tamaños |
| VERIFICACION.md | Comprobaciones realizadas y límites de la evidencia |
| SHA256SUMS.txt | Huellas para comprobar los archivos de la entrega |

No incluye node_modules, bases de datos personales, sesiones, secretos, respaldos, la configuración histórica de Render de pago ni una publicación remota automática. Conserva el código histórico en fuente separado del sitio publicable para mantener recuperable el proyecto.

## 10. Qué falta para abrirlo como servicio real

Esta lista describe pendientes reales. No son funciones activas ocultas.

| Prioridad | Pendiente | Quién puede hacerlo |
|---|---|---|
| 1 | Revisar y activar la migración 3.2 en un entorno Supabase aislado; después validar el despliegue de producción | Desarrollo; autorización del titular cuando corresponda |
| 2 | Probar el recorrido con cuentas reales autorizadas Usuario/Empresa en staging y en dispositivos físicos | Desarrollo y titular con negocios piloto |
| 3 | Definir recompensas sostenibles, condiciones, horarios y contenidos reales de cada negocio | Cada negocio; desarrollo prepara formularios |
| 4 | Empleados y permisos por función, sucursales y administración de organizaciones | Desarrollo con reglas operativas definidas por el titular |
| 5 | Disponibilidad por profesional, reprogramación, recurrencias, cupos y sincronización de calendario | Desarrollo |
| 6 | Push y recordatorios programados; preferencias y permisos de comunicación | Desarrollo y titular para proveedores/cuentas |
| 7 | Búsqueda y paginación completas para volúmenes grandes | Desarrollo |
| 8 | Catálogos complejos, OCR, XLSX y mapeo de columnas configurable | Desarrollo según documentos reales del negocio |
| 9 | Métricas de retorno por cohortes, campañas segmentadas y medición de efectividad | Desarrollo y negocios piloto |
| 10 | Publicación web definitiva, dominio si se desea y validación de instalación móvil/PWA | Desarrollo y titular; conservar presupuesto autorizado |
| Fase final solicitada | Revisión adicional de seguridad y datos: pruebas de RLS multiusuario, carga/concurrencia nativa, protección frente a abuso, recuperación, copias/restauración, registros y monitoreo | Desarrollo y titular |
| Fase final solicitada | Correo: remitente, SMTP, plantillas, límites, enlaces y entrega real | Titular para cuenta/proveedor; desarrollo para integración |
| Antes de lanzamiento público | Aviso de privacidad, términos, consentimiento de comunicaciones y procedimiento de soporte/bajas | Titular y profesionales correspondientes; desarrollo lo implementa |

Los límites de las consultas también importan: el módulo devuelve lotes acotados —hasta 500 elementos de catálogo, 300 citas y movimientos, y 100 avisos, promociones o retos— y todavía no ofrece paginación completa. Una organización grande necesita ampliar esa operación antes de usarlo masivamente.

La seguridad básica del código se conserva durante esta etapa: separación por cuenta/negocio, RLS, validación y transacciones. Posponer la revisión adicional no la sustituye. La salida a público sigue pendiente hasta validar el entorno real.

## 11. Referencia técnica para continuar

El frontend usa HTML, CSS y módulos JavaScript. workspace.js maneja identidad y perfil; loyalty-ui.js maneja el núcleo; studio-ui.js maneja los módulos 3.2; studio-rules.js contiene reglas puras y presets; catalog-import.js interpreta documentos y adapta logos. studio.css extiende la identidad visual.

La migración 20261117023910_studio_32.sql añade ocho tablas, once funciones públicas de operación, campos de recompensa y eventos para movimientos/avisos. Se apoya en el núcleo 20261117013535_loyalty_core.sql. La propuesta antigua business_onboarding.sql sigue separada y no debe aplicarse como si fuera el núcleo.

Las funciones públicas nuevas son cia_studio_snapshot, cia_studio_save_business, cia_studio_save_catalog, cia_studio_save_promotion, cia_studio_adjust_points, cia_studio_save_appointment, cia_studio_update_appointment, cia_studio_read_notice, cia_studio_save_challenge, cia_studio_claim_challenge y cia_studio_save_reward.

No apliques todos los archivos SQL indiscriminadamente a producción. El historial remoto ya contiene perfiles y núcleo. Usa revisión de migraciones y un entorno aislado antes de activar 3.2.

Para verificar el código: `node scripts/verify.mjs`. Para construir el frontend: `node scripts/build-pages.mjs`. El resultado solo contiene la lista de scripts/pages-files.mjs. La prueba local usa PostgreSQL 17.5/PGlite, no certifica contención entre conexiones PostgreSQL nativas independientes.

PDF.js y fflate se incluyen como recursos locales con sus licencias. Se utilizan para extracción PDF y DOCX; no son servicios remotos de pago. Consulta VERIFICACION.md para el alcance exacto de las pruebas de esta entrega.

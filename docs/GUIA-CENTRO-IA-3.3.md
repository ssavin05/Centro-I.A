# Centro I.A. 3.3 — Funciones, operación y pendientes

Corte: 25 de noviembre de 2026, hora del Pacífico. Esta guía sustituye los estados de la entrega 3.2. Conservamos aquella guía como historial y referencia detallada de importaciones.

**Estado real:** Studio 3.2 está aplicado a Supabase; sedes, equipo y agenda avanzada 3.3 funcionan y están probados localmente. Su activación remota no se completó: el conector devolvió confirmación vencida. La nueva interfaz no se publicó en Pages ni se integró en main. La prueba local y el ZIP no equivalen a lanzamiento público.

## 1. Abrir y probar

1. Extrae el ZIP completo. Necesitas Node.js 22.13 o posterior.
2. Ejecuta INSTALAR-DEPENDENCIAS.bat si todavía no instalaste las dependencias. La primera vez requiere Internet.
3. Ejecuta INICIAR-Cia.IA.3.3.bat y conserva abierta la ventana.
4. Abre http://127.0.0.1:4176/workspace.html?as=company o http://127.0.0.1:4176/workspace.html?as=user.
5. Comprueba PRUEBA LOCAL. El selector Empresa/Usuario/Gerente/Profesional/Recepción usa cinco identidades ficticias en este equipo, sin cuentas reales ni Supabase.
6. Crea el programa como Empresa y une al Usuario mediante su código. Para probar personal, crea una invitación y acéptala desde la identidad local correspondiente.

Desde fuente puedes ejecutar node scripts/start-33.mjs. Ctrl+C detiene el servidor. Los datos locales persisten en .local-centro-fidelidad junto a fuente; no están incluidos en el ZIP ni en el sitio publicable. Se conservan los datos previos de este equipo. No compartas ese servidor como servicio público.

## 2. Cuadro general de funciones

Implementado significa código disponible y probado. Las funciones de operación 3.3 siguen pendientes de activación remota.

| Función | Usuario o cliente | Empresa propietaria | Cómo funciona / límite |
|---|---|---|---|
| Registro y cuenta | Elige Usuario, mantiene perfil y nombre | Elige Empresa, mantiene perfil y nombre | Tipo protegido e inmutable; correo operativo requiere validación real |
| Inicio | Sus negocios, puntos y actividad | Clientes, visitas y entregas del programa | Datos derivados de registros, sin estadísticas inventadas |
| Explorar | Busca y se une a programas publicados | Decide publicar o mantener privado | Un negocio nuevo comienza privado |
| Código de programa | Se une sin duplicar membresía | Comparte su código | Distinto del código laboral de un solo uso |
| Creación de empresa | No administra negocios | Asistente de cuatro pasos y edición posterior | Un programa por propietario; varias sedes dentro de él |
| Personalización | Consulta identidad y oferta | Ocho giros, cuatro formas de trabajo y cuatro temas | Peluquería, comida, comercio, bienestar, actividad, servicios, organización y otro |
| Logo | Lo ve en la oferta | Sube, cambia o quita logo después de crear | PNG/JPG/WEBP hasta 5 MB; adaptación local hasta 512 px |
| Menú y servicios | Consulta categorías, productos, servicios y precios | Crea, edita, pausa, importa y exporta CSV | Informativo; no es caja ni procesa pagos |
| Importación | No modifica catálogos ajenos | Revisa filas antes de guardar | CSV/TSV/JSON/HTML/TXT/Markdown/DOCX/PDF con texto; sin OCR ni XLSX directo |
| Llegada y salida | Las registra voluntariamente | Consulta y confirma visitas | No detecta ubicación pasiva ni una salida no registrada |
| Puntos | Saldo separado por negocio | Confirma visita y ajusta con motivo | Abono solo tras confirmar; ajuste rechaza saldo negativo |
| Visitas | Consulta próxima llegada e historial | Consulta clientes y estados | Separación mínima de 18 h entre llegadas |
| Premios | Consulta condiciones y confirma canje | Crea, edita, pausa y confirma entrega | Producto, descuento, servicio, experiencia o regalo |
| Canje | Gasta puntos y recibe comprobante | Gestiona entregas | Saldo/stock en transacción; idempotencia evita descuento duplicado |
| Promociones | Ve ofertas vigentes | Crea descuento, paquete, especial o novedad | El negocio aplica la oferta al atender; no hay POS integrado |
| Retos y niveles | Sigue avance y solicita bono | Define periodo, visitas y puntos extra | Bono una vez; Explorador/Habitual/Preferente no cambian permisos |
| Avisos | Bandeja privada y leído/no leído | Recibe solicitudes pertinentes | Internos; no push, SMS, WhatsApp ni correo automático |
| Sedes 3.3 | Elige sede disponible | Crea, edita y pausa sedes adicionales | Zona propia, recursos y equipo; puntos del programa compartidos entre sedes |
| Equipo 3.3 | Acepta invitación si va a trabajar | Invita, cambia función, pausa o revoca | Función por sede; cuenta personal conservada |
| Recursos 3.3 | Consulta disponibilidad | Organiza profesionales, salas, mesas y equipo | Un recurso atiende una cita confirmada a la vez |
| Jornada 3.3 | Elige horas ofrecidas | Días, apertura, descanso, cierre y ausencias | Sin jornada guardada no hay disponibilidad |
| Solicitudes 3.3 | Solicita y espera confirmación | Confirma o crea cita manual/bloqueo | Solicitud pendiente no aparta la hora |
| Reprogramación 3.3 | Cambia su cita y vuelve a solicitar confirmación | Cambia horario con disponibilidad real | Revisión impide sobrescribir cambios ajenos |
| Repetición 3.3 | Hasta ocho citas semanales | Igual | Lote atómico; conserva hora local de sede, cada cita se edita aparte |
| Historial 3.3 | Datos de sus citas | Cambios autorizados de citas | No inventa eventos históricos de registros antiguos |
| Móvil y tablet | Navegación inferior y Más | Misma estructura según permisos | Controles táctiles y adaptación de tablas |
| Animaciones | Entrada/salida y celebración breve confirmada | Feedback de operación | Respeta reducción de movimiento; no celebra errores |
| Descargar perfil | Campos guardados de su perfil | Igual | No es exportación completa comercial |
| Actualizar y cerrar sesión | Disponibles | Disponibles | No hay sincronización permanente en tiempo real |

## 3. Tipos de cuenta y permisos de trabajo

Usuario participa en varios programas y conserva saldos separados. Empresa administra su propio programa. La elección Organización describe el giro: no concede privilegios administrativos extra.

| Función | Puede hacer | Límites |
|---|---|---|
| Propietario | Sedes, invitaciones, equipo, recursos y citas de su negocio; catálogo/premios/puntos | Sin acceso a negocios ajenos |
| Gerente de sede | Recursos, jornadas, ausencias y citas de su sede | No invita, da permisos, cambia propietario o ajusta puntos |
| Recepción | Consulta y gestiona citas de su sede | No modifica recursos, jornada ni permisos |
| Profesional | Atiende citas de recursos asignados y configura sus horarios/ausencias | No opera citas de otros profesionales por ser su cliente |
| Cliente | Consulta, solicita, reprograma y cancela sus citas activas | No confirma ni completa citas |

La función laboral se añade por sede sin convertir Usuario en Empresa. No hay superadministrador, nómina, contabilidad ni ERP. Los niveles de fidelidad son Explorador con menos de 3 visitas confirmadas, Habitual de 3 a 9 y Preferente desde 10, por negocio.

## 4. Crear empresa, logo, menú y beneficios

1. Como Empresa abre Mi negocio, elige giro y forma de trabajo.
2. Completa nombre, categoría, ciudad, descripción, contacto, tema y puntos por visita.
3. Revisa la configuración, guarda y comprueba el código de programa.
4. Sube el logo desde Tu logo, tu firma. El archivo se adapta localmente antes de guardar.
5. Prepara menú o servicios. Añade elementos manualmente o importa un documento.
6. Revisa nombres, categorías, precios, moneda y duración antes de Guardar catálogo revisado. Usa Editar y Pausar después.
7. Crea premios con coste, condiciones, stock y vigencia; promociones y retos con fechas reales.
8. Publica en Explorar cuando el contenido esté listo. Invita clientes y confirma sus visitas reales.

Importación: hasta 10 MB, PDF con texto de hasta 50 páginas y revisión de hasta 250 filas por lote. CSV mayor de 1000 filas requiere dividirlo. PDF escaneado, imágenes y formatos propietarios necesitan captura manual o exportación CSV. El documento se interpreta en navegador; se guardan las filas revisadas, no el original. HTML no se ejecuta. DOC antiguo no es DOCX. Precios en MXN/USD/EUR sin conversión automática. Catálogo admite duraciones hasta 1440 min, pero agenda organizada solo hasta 720 min.

Llegada → confirmación de visita → puntos → confirmación de canje → entrega. Los puntos no son dinero. Una cita completada no suma puntos por sí sola. Ajustes necesitan motivo; los retos comprueban visitas confirmadas dentro del periodo y conceden un solo bono por persona.

## 5. Preparar sedes y equipo

1. Abre Equipo y sedes; en celular Más → Equipo y sedes o Reservar. El colaborador ve Mi trabajo.
2. En Sedes añade nombre, referencia y zona horaria. La principal se conserva activa. Pausar otra sede no borra citas, pero retira su oferta de recursos al cliente.
3. Selecciona sede → Equipo → Crear invitación. Elige función y referencia.
4. Copia el código y compártelo manualmente con la persona indicada. No se envía correo.
5. La persona abre Tengo una invitación de trabajo desde su cuenta, pega el código y se une. Caduca en siete días y admite un destinatario.
6. Puedes revocar invitaciones pendientes o editar/pausar acceso. Pausar al colaborador también pausa sus recursos; las citas se conservan para reorganizar. Reactivar acceso no reactiva recursos automáticamente.
7. Añade recursos con responsable de la sede, si corresponde. Guarda su jornada antes de ofrecer citas.

No se comparte contraseña. La sede seleccionada decide qué controles se muestran y la base vuelve a comprobar el permiso. Sedes y equipo no alteran los saldos de fidelidad del programa.

## 6. Agenda, descansos y reservas

En Recursos y horarios marca días, apertura/cierre y un descanso opcional por día. Sin días guardados no aparecen horas. Cambiar jornada no cancela citas existentes. Ausencia bloquea un periodo; si hay citas confirmadas, primero debes reorganizarlas.

1. Selecciona sede → Agenda → Solicitar cita o Añadir cita.
2. Elige recurso, servicio opcional, fecha y duración de 5 a 720 min. Un servicio usa su duración guardada.
3. Consulta horarios y elige una opción. Se ofrecen tramos cada 15 min dentro de la jornada, fuera de ausencias y citas confirmadas.
4. El cliente envía una solicitud Por confirmar. Personal autorizado puede confirmar o crear directamente una cita confirmada.
5. Personal autorizado completa o cancela según función; el cliente cancela únicamente sus citas. Completada/cancelada son estados terminales.
6. Cambiar horario comprueba disponibilidad y revisión actual. Si lo hace el cliente, vuelve a Por confirmar. Historial conserva el cambio.
7. Una repetición genera hasta 8 citas semanales. Si alguna falla, no se guarda parcialmente la serie. Cada cita se cambia por separado.

Agenda y disponibilidad usan la zona de la sede. Las dos fechas de ausencia se introducen en la zona del dispositivo, indicada en pantalla. El calendario anterior conserva la zona del dispositivo. Hay horizonte de 366 días. Los bloqueos internos no crean clientes ficticios. Solicitudes no confirmadas pueden coincidir. No hay cupos grupales, espera, sincronización externa, anticipos ni reasignación masiva.

## 7. Colores, animación y avisos

| Paleta | Uso |
|---|---|
| Azul noche #102A43 y profundo #173C50 | Navegación, estructura y texto |
| Azul océano #123E5B / claro #E1EEF7 | Temas, superficies y contexto |
| Dorados #EDC77D / #D9AF63 | Selección, reconocimiento y acciones |
| Blanco #FFFFFF y negro azulado #0D151B | Contenido y contraste |

Cuatro temas conservan identidad Centro I.A. Entrada/salida breve de paneles, confirmaciones finitas y movimiento reducido respetado. No se retrasa acceso ni se inventan recompensas. Avisos internos privados con contador/lectura; requieren actualizar datos, sin envío de fondo.

## 8. Qué falta para el lanzamiento

| Prioridad | Pendiente | Responsable |
|---|---|---|
| 1 | Activar Operations 3.3 junto a su corrección; conector devuelve confirmación vencida | Desarrollo y autorización del servicio |
| 2 | Publicar frontend y probar cuentas/JWT reales Usuario, Empresa y personal | Desarrollo y titular con cuentas autorizadas |
| 3 | Pilotos con negocios, premios, condiciones y horarios reales | Titular y negocios |
| 4 | Paginación, concurrencia nativa y carga para organizaciones grandes | Desarrollo |
| 5 | Correo operativo, push y recordatorios con preferencias | Desarrollo; titular para remitente/cuentas |
| 6 | Cupos grupales, espera, reasignación masiva y calendario externo | Desarrollo |
| 7 | Métricas por cohortes y campañas segmentadas | Desarrollo y pilotos |
| 8 | OCR, XLSX y mapeo configurable para documentos complejos | Desarrollo según archivos reales |
| 9 | QR/cámara e instalación móvil/PWA | Desarrollo |
| Antes de abrir al público | Seguridad adicional, abuso, backups/restauración y monitoreo | Desarrollo y titular |
| Antes de abrir al público | Privacidad, términos, consentimiento y soporte/bajas | Titular y profesionales correspondientes |

Lotes acotados, sin paginación completa: hasta 200 sedes/equipo,300 recursos/citas/eventos y 500 elementos de catálogo según módulo. No se certifica escala masiva. Presupuesto de infraestructura $0 MXN. No se enviaron mensajes ni se crearon fixtures de producción.

## 9. Archivos, pruebas y estado de Supabase

| Elemento | Estado |
|---|---|
| Cia.IA.3.3.zip | Código, sitio construido, guía, capturas y huellas; sin bases, sesiones, secretos ni dependencias |
| Fuente | Editable; conserva módulos históricos separados del frontend oficial |
| Sitio publicable | Lista explícita scripts/pages-files.mjs, sin adaptador ni selector local |
| Perfiles y loyalty_core | Aplicados previamente; no reaplicar |
| 20261125154520_studio_32.sql | Aplicado 25 nov; mismo SQL de la propuesta original 20261117023910 |
| 20261125175119_operations_33.sql | Local, pendiente remoto |
| 20261125175129_operations_33_hardening.sql | Corrección obligatoria, pendiente remoto |

No actives Operations sin su corrección. La propuesta antigua business_onboarding.sql sigue separada. Catorce tablas cia_* tienen RLS y once RPC Studio requieren authenticated y search_path vacío. Se preservaron dos perfiles; hay cero programas en producción. No se han validado JWT reales de todos los roles ni publicado esta interfaz.

Verificación completa:89/89 pruebas, sintaxis, enlaces, imports y build de Pages. La prueba PostgreSQL 17.5/PGlite no certifica contención entre conexiones nativas independientes. El servidor real es PostgreSQL 17.11. Navegador: guardado con cierre/foco y vistas 1440/768/390; revisor independiente dio ship al alcance capturado, no a todos los formularios ni a una auditoría de accesibilidad. Consulta VERIFICACION-3.3.md.

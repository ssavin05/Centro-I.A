# Centro I.A. 3.7 · color y movimiento para Usuario

## Qué cambió

El inicio personal usa un azul tinta más profundo y océano, con cielo para la próxima visita y dorado para la acción y los premios disponibles. Cada negocio conserva su propio saldo y su premio concreto.

| Elemento | Comportamiento |
|---|---|
| Premio principal | Icono dorado, estado de disponibilidad, coste y avance real juntos. |
| Entrada y cambio de objetivo | Revelado breve de premio, respuesta del icono y barra real; secuencia máxima de 620 ms. |
| Premios disponibles | Arte dorado y texto de estado; los demás conservan el azul. |
| Filtros y negocio | Los primeros tres resultados responden con una entrada breve, hasta 300 ms. |
| Navegación | Respuesta breve del icono activo y feedback de pulsación. |
| Promociones | Descuentos en dorado claro; otros tipos en cielo, con sus condiciones. |
| Accesibilidad | Movimiento reducido y pestaña oculta cancelan las animaciones. Sin bucles ni retrasos para usar acciones. |

## Cómo verlo

Esta entrega 3.7 se revisa desde el ZIP y la prueba local. La web https://ssavin05.github.io/Centro-I.A/ conserva 3.6: la subida pública necesita aprobación explícita tras el rechazo automático. En Inicio y Premios puedes cambiar de negocio y usar los filtros; una cuenta vacía ofrece pasos para empezar.

Para revisar ejemplos locales, instala dependencias con Node.js 22.13 o posterior y pnpm 11.25.0. Ejecuta node scripts/review-37.mjs y abre http://127.0.0.1:4179/workspace.html?as=user. La franja PRUEBA LOCAL identifica los datos sintéticos aislados. El ZIP incluye los dos archivos BAT de instalación y arranque.

## Usuario y Empresa

| Usuario | Empresa |
|---|---|
| Consulta saldo y avance por negocio, premios y promociones. | Configura su negocio, identidad visual, catálogo, premios y promociones. |
| Solicita citas, participa en retos y consulta actividad. | Gestiona citas, equipo, recursos, visitas y ajustes con motivo. |
| Canjea y consulta su recogida; registra llegadas/salidas voluntarias. | Confirma operaciones y entrega de premios mediante los flujos existentes. |

Esta ampliación visual se concentra en Usuario. Las operaciones dependen de confirmaciones del servidor. La guía 3.4 conserva el cuadro completo de capacidades.

## Evidencia y límites

111 de 111 pruebas locales aprobadas y construcción correcta. Cuatro capturas de escritorio, móvil y tablet, incluida cuenta vacía. Sin desbordamiento horizontal observado; botones principales de móvil de al menos 49 px y filtros de 44 px. Revisión independiente: ship, sin arreglos materiales. No representa una auditoría integral de accesibilidad o de todos los dispositivos.

Seis pares principales de texto medidos con contraste de 5.17:1 a 10.84:1. Las animaciones tienen pruebas de cancelación, sustitución y límite de resultados; las capturas verifican composición estática. No se agregaron dependencias ni migraciones.

## Lo que necesita participación del titular

Contenido real de negocios y condiciones de premios; validación de correo y URLs privadas; cuentas reales y piloto con teléfonos físicos. El respaldo de datos personales y su restauración de producción siguen pendientes de autorización específica. Continúan pendientes push del sistema, entrega de correo acreditada y pruebas de carga. Son trabajo pendiente y no se presentan como terminado en esta entrega.

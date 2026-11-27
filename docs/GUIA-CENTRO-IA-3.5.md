# Centro I.A. 3.5 — experiencia de Usuario

Esta entrega mejora el uso diario de tu cuenta Usuario. Conserva las funciones de fidelidad, catálogo, agenda, equipo y actividad de 3.4. Consulta GUIA-CENTRO-IA-3.4.md para el cuadro completo de la aplicación.

## Abrir la prueba

Necesitas Node.js 22.13 o posterior y las dependencias del proyecto.

1. Extrae todo Cia.IA.3.5.zip.
2. Ejecuta INSTALAR-DEPENDENCIAS.bat si faltan dependencias. La instalación necesita Internet.
3. Ejecuta INICIAR-Cia.IA.3.5.bat y conserva su ventana abierta.
4. Abre http://127.0.0.1:4178/workspace.html?as=user.
5. Comprueba que aparece PRUEBA LOCAL y los dos negocios de ejemplo. El selector sirve para probar vistas; no autentica cuentas reales.

La base de esta revisión está separada en work/.local-centro-35 (fuera del código). El script scripts/review-35.mjs solo crea ejemplos en esa base y nunca se conecta a Supabase.

## Qué puedes hacer como Usuario

| Pantalla o acción | Cómo funciona |
|---|---|
| Inicio personal | Elige uno de tus negocios y consulta su premio destacado y sus puntos. Los saldos permanecen separados. |
| Mi avance | Cada premio indica puntos actuales, objetivo y lo que falta. Ver mi avance destaca ese objetivo en Inicio durante la sesión. |
| Canje disponible | La acción dorada abre la confirmación de canje existente. El servidor comprueba saldo y disponibilidad antes de confirmar; pedir un premio no acredita su entrega. |
| Mi siguiente paso | Muestra primero un premio pendiente de recoger; después la próxima cita; si no hay ninguno, ofrece registrar llegada o salida voluntaria. |
| Premios | Combina búsqueda, negocio y filtros Todos/Puedo canjear/Por alcanzar. El historial de canjes sigue disponible. |
| Mi constancia | Los niveles Explorador/Habitual/Preferente dependen de visitas confirmadas (umbrales 3 y 10). El nivel por sí solo no promete beneficios. |
| Retos | Consulta visitas y puntos de bono. Recibir mi bono solo queda disponible al cumplir las reglas; el servidor confirma la concesión única. |
| Promociones | Inicio muestra promociones vigentes del negocio elegido y ofrece consultar sus condiciones. |
| Actividad reciente | Reúne visitas, estado final de canjes y ajustes/bonos sin duplicar el registro de puntos de una visita o devolución. |
| Accesos personales | Abre premios, citas o negocios desde Inicio. Se mantienen las notificaciones internas y el resto de secciones. |

## Colores y movimiento

Azul noche #102a43, azul océano #123e5b, cielo #e1eef7/#dceefa, superficies blancas y dorado #edc77d. El premio y su acción tienen la mayor jerarquía. Las barras comunican progreso real y ofrecen etiquetas para lectores de pantalla.

Al cambiar de negocio aparece el objetivo con una transición finita de clip y su barra. Los botones responden al pasar o pulsar; se conservan entrada/salida de paneles y confirmaciones existentes. Sin bucles ni esperas de acceso. La preferencia de movimiento reducido omite esas animaciones. Una subida de saldo de la misma identidad muestra una confirmación breve solo tras recibir datos actualizados; la primera carga no se celebra.

En celular la composición se apila y conserva navegación inferior; tablet mantiene navegación compacta; escritorio dispone premio y próxima acción juntos. Los filtros tienen objetivos táctiles de44px y los negocios se desplazan horizontalmente.

## Diferencias con Empresa

Empresa mantiene su composición y herramientas: configuración por giro, logo, catálogo/importación, premios, promociones, retos, clientes, agenda, sedes y equipo. El nuevo inicio y filtros personales solo pertenecen a Usuario. Ningún efecto visual concede permisos, puntos o stock.

## Estado y límites

Los cambios 3.5 son frontend; no añaden migraciones ni servicios de pago. Núcleo, Studio y Operations se registraron como activados en el corte3.4; Growth3.4 continúa pendiente de activación remota. Esta entrega no está publicada en Pages ni guardada en una nueva revisión de la rama remota. La prueba usa ejemplos identificados, no cuentas de producción.

Las notificaciones siguen siendo internas: no hay push, SMS o correo de campañas. Las citas de Inicio indican hora del dispositivo. No hay geolocalización pasiva. La revisión visual cubre tres capturas, no una auditoría integral ni dispositivos físicos.

## Pendientes de desarrollo

Publicar el frontend revisado, completar el guardado en la rama, activar y validar Growth en el entorno remoto, recorrer cuentas reales, ampliar pruebas de dispositivos y completar el trabajo de producción de PENDIENTES-TECNICOS-3.4.md. Son tareas de desarrollo; este cambio visual no las da por terminadas.

## Al final: lo que necesita tu participación

Aportar identidad/contenido y condiciones reales de los negocios, validar cuentas que controles y realizar el piloto con personas/dispositivos físicos. La lista completa permanece en TAREAS-DEL-TITULAR-3.4.md. No necesitas programar para completar estas decisiones.

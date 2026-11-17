# Interior de fidelidad · Centro I.A.

Modo: Operate. Rediseño completo del antiguo perfil vacío dentro de la identidad aprobada: dorados, azules claro/profundo, negro y blanco.

Propósito: el Usuario encuentra sus negocios y premios, registra llegada/salida y canjea sus puntos. Empresa crea un programa y premios, confirma visitas reales, ve clientes y entrega canjes. La cuenta mantiene su tipo inmutable.

Primer viewport: navegación propia estable, saludo, ticket de regreso azul profundo con acción dorada; indicadores reales y acceso a negocios/actividad. Escritorio usa barra lateral; celular usa navegación inferior. Tablet usa iconos.

Interacción principal: llegada voluntaria → confirmación Empresa → puntos por negocio → canje atómico → entrega confirmada. Una llegada cada 18 horas; jamás geolocalización pasiva. El canje usa diálogo nativo de confirmación.

Estados: carga, error recuperable, datos vacíos, módulo sin activar y datos reales del entorno. Sin números inventados. La prueba local siempre se identifica como PRUEBA LOCAL y no comparte cuentas ni datos con Supabase.

Contrato técnico: HTML/CSS/ES Modules, RPC Supabase, RLS y transacciones. Base de prueba persistente PostgreSQL 17.5/PGlite, aislada fuera del repositorio. Presupuesto cero. Producción bloqueada por revisión automática; no se ha aplicado la migración.

Calidad: controles de 44px, foco visible, texto contrastado, búsqueda/filtrado, escape de datos dinámicos y limpieza por cambio de identidad. Movimiento reservado para feedback y confirmaciones; reducción de movimiento.

Evidencia: .impeccable/review/interior. Capturas de viewport; fullPage no funcionó en el navegador de esta sesión. Recorrido completo y persistencia comprobados en navegador. No es auditoría WCAG completa ni certificación de concurrencia PostgreSQL entre conexiones independientes.

Revisión pendiente conocida: los iconos de navegación tablet pierden nombre accesible al ocultar el span con display:none. Deben conservar aria-label, también marca y logout.

# Centro I.A. — Estado real y pendientes de producción

## Ya funcional en el paquete local

- Aplicación con servidor HTTP, SQLite persistente, migraciones y prueba de API.
- Separación de cuentas Empresa/Usuario y de datos privados entre negocios.
- Registro, inicio/cierre de sesión, sesiones HttpOnly, scrypt, CSRF y cambio de contraseña.
- Creación de negocios/sucursales, empleados con código de invitación, roles básicos.
- Eventos, reservas con cupos y cancelaciones, asistencia, visitas, puntos y recompensas.
- Códigos QR temporales con un solo uso y validación de empresa.
- Estadísticas basadas en datos, exportación CSV, borradores de campañas, análisis local.
- PWA instalable con caché limitado a recursos estáticos.
- Respaldos manuales, auditoría de acciones principales y pruebas automatizadas.

## Pendiente antes de abrir a clientes públicos

**Identidad y privacidad:** verificación por correo, recuperación de contraseña por email, eliminación de cuentas y datos, solicitudes ARCO, políticas de privacidad, consentimiento y mecanismos de baja, manejo formal de empleados y permisos por operación.

**Pagos y negocio:** pasarela real (Mercado Pago o Stripe, según disponibilidad), configuración comercial, suscripciones, comprobantes/facturación y validación de webhook, reembolsos y conciliación. Los importes de eventos son informativos: no se cobran.

**Mensajería:** proveedor de email/WhatsApp, plantillas, opt-in/opt-out, colas, reintentos, entregabilidad, webhooks y registros de envío. Las campañas **solo se guardan**, no se envían.

**Escalamiento y robustez:** trasladar el backend de SQLite a PostgreSQL administrado para mayor concurrencia, trabajos en segundo plano, límites de uso persistentes (no solo en memoria), rate limiting delante del servidor, panel de administración y alertas, programación automática de respaldos, restauración probada, pruebas de carga, despliegue con HTTPS y políticas de seguridad de infraestructura.

**Experiencia de usuarios:** sistema de diseños/plantillas avanzadas por tipo de negocio, edición/cancelación completa de eventos y recompensas, gestión avanzada de sucursales y empleados, favoritos accesibles en la vista de usuario, búsqueda geográfica, páginas de negocios con imágenes, notificaciones push, correo y disponibilidad más granular para citas personales.

**IA:** el asistente local de métricas funciona; un proveedor generativo exige credenciales, consentimiento explícito, presupuesto, límites y evaluación del contenido. Predicciones reales requieren historial suficiente. El módulo de API no se ha probado con claves de terceros.

**Calidad y legal:** pruebas e2e en navegadores públicos y dispositivos reales, pentest independiente, pruebas de accesibilidad, política de incidentes, términos, gestión de datos personales, contratos de proveedores y asesoría legal aplicable en México.

## Límites actuales importantes

- Se usa **SQLite** porque el paquete debe funcionar sin instalar servidores adicionales. No es PostgreSQL ni Supabase y no está conectado a una nube.
- No hay conexión a Stripe, Mercado Pago, Gmail, WhatsApp o Google Login todavía.
- No existe app móvil nativa: es una **PWA web instalable**.
- No existe un panel de superadministrador ni gestión de suscripciones de pago.
- Los registros de ingresos no se inventan; si la plataforma no tiene ventas verificadas, no muestra datos de ingresos.
- No hay hosting contratado, dominio asociado, pagos activos ni claves externas incluidas.
- La demo anterior se conserva para referencia, pero **no comparte datos** con el nuevo servidor.

## Secuencia de evolución recomendada

1. **Piloto cerrado:** dos o tres negocios y usuarios de prueba, resolver los hallazgos y afinar interfaz.
2. **Cuentas públicas:** email verificado, recuperación, borrado de cuenta, textos legales y consentimientos.
3. **Infraestructura pública:** HTTPS, base de datos gestionada, backups automáticos, monitoreo, pruebas de carga y auditoría de seguridad.
4. **Comercialización:** pagos verificados, planes, facturas y sistema de soporte.
5. **Automatización:** comunicaciones verificadas y con consentimiento; IA generativa de forma optativa.
6. **Crecimiento:** POS/ERP y otras integraciones solo después de validar las operaciones principales.

## Estado de la interfaz inspirada en programas de lealtad (noviembre de 2026)

La **nueva experiencia** de fidelidad visible en GitHub Pages (`index.html` + `app.js` + `styles.css`) está terminada como **demo interactiva**. Su información se guarda exclusivamente en `localStorage`; los ejemplos de comercios, clientes, puntos, reservas y cupones son ficticios. No representa transacciones reales. No emplea logos, código o recursos exclusivos de Leal.

El **backend anterior** (`server/`, `app/`) contiene operaciones compartidas de fidelidad y reservas, pero aún conserva otra interfaz. El trabajo imprescindible para producción es **conectar las pantallas nuevas con las rutas autenticadas del backend**, sustituir las acciones de `localStorage` por operaciones validadas en servidor, y luego desplegar ambos bajo HTTPS con control de permisos, backups y pruebas de carga. Sin ello, GitHub Pages es solo una demostración visual, no la aplicación comercial.
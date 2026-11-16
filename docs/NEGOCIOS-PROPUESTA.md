# Propuesta aislada para alta de negocios

Estado: probada localmente, sin aplicar a Supabase y sin interfaz pública. No habilita puntos, reservas, recompensas ni directorio.

## Modelo y límites

supabase/proposals/business_onboarding.sql define negocio privado, miembro propietario, sucursal principal, borrador por propietario y actividad. Todas las tablas tienen RLS. Las cuentas autenticadas solo leen filas propias; las escrituras directas se revocan. Las RPC consultan el tipo Empresa en el perfil protegido, nunca los metadatos del cliente.

Las funciones públicas usan SECURITY DEFINER deliberadamente, search_path vacío, nombres calificados, validación de actor y EXECUTE exclusivo de authenticated. Los helpers privados no están disponibles al cliente. El propietario, estado y roles no forman parte del payload aceptado.

## Contratos previstos

- cia_save_business_draft(p_payload jsonb, p_step integer, p_revision integer): envía el documento completo, paso 1–4 y revisión leída, inicialmente 0. Devuelve el borrador normalizado con revisión incrementada. La misma petición repetida con la revisión anterior devuelve el resultado existente.
- cia_finish_business_onboarding(p_revision integer): valida campos obligatorios y crea negocio privado, propietario, sucursal y actividad en una transacción. Devuelve UUID; repetir tras finalizar devuelve el mismo UUID.

Campos: name, category, description, country, city, address, phone, contact_email, brand_color, timezone, hours, service_description, uses_points, uses_rewards y accepts_bookings. Los tres últimos son preferencias; no activan sus funciones.

Categorías: cafeteria, restaurante, belleza, bienestar, comercio, servicios, experiencias y otro. País usa dos letras mayúsculas; zona horaria debe existir en PostgreSQL. Horarios y servicios son texto descriptivo; no representan disponibilidad de reservas.

Errores SQLSTATE: 42501 para cuenta no autorizada, 22023 para datos/pasos inválidos o borrador inexistente y 40001 para conflicto de revisión. El futuro cliente debe recargar y resolver conflictos, conservando entradas. No reintentar mutaciones automáticamente.

## Antes de activar

1. Revisar el modelo, especialmente publicación, miembros y sucursales.
2. Generar migración versionada con Supabase CLI y probar en entorno aislado PostgreSQL 17. No pegar esta propuesta directamente en producción.
3. Verificar grants, RLS y RPC con JWT reales de dos Empresas y un Usuario. Probar contención desde conexiones independientes.
4. Conectar el formulario de cuatro pasos, restauración de borrador, errores, cargas y navegación accesible.
5. Añadir pruebas de navegador con ese entorno y revisar el despliegue mediante PR.

No incluye logo/archivos, edición posterior, invitaciones, publicación, sucursales adicionales, eliminación, directorio ni métricas.

## Evidencia

tests/postgres-security.test.mjs verifica aislamiento, permisos, idempotencia, conflictos de revisión y rollback provocando un fallo intermedio. El motor local es PGlite/PostgreSQL 18.6 sobre una conexión; no sustituye Supabase Auth ni la prueba concurrente en PostgreSQL 17.

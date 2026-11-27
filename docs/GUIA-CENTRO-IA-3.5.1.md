# Centro I.A. 3.5.1 — respaldo y verificación

Esta entrega técnica conserva la experiencia de Usuario 3.5 y añade respaldo rastreable y pruebas de contención real. Para usar las pantallas consulta GUIA-CENTRO-IA-3.5.md; para el cuadro completo de la aplicación consulta GUIA-CENTRO-IA-3.4.md.

## Cambios comprobados

- Código 3.4 y 3.5 guardado en la rama codex/fundamentos-acceso-seguro-2026-11-12 del repositorio ssavin05/Centro-I.A, dentro del PR1 existente. Main y la rama de archivo permanecen en sus commits anteriores.
- Comprobaciones automáticas remotas aprobadas sobre 3.5; la ampliación de CI conserva el frontend construido como artefacto durante siete días. Solo incluye dist, que procede del manifiesto público.
-106/106 pruebas locales aprobadas, imports/sintaxis y build correctos. Se añaden dos pruebas que impiden iniciar el verificador PostgreSQL con un destino remoto, un puerto habitual o sin autorización explícita de prueba.
- PostgreSQL 17.11 nativo en contenedor efímero: dos conexiones de cliente compiten mientras una tercera retiene el bloqueo. El verificador exige observar ambas sesiones esperando antes de liberarlo. No depende de la serialización de PGlite.

## Qué prueban las carreras

| Caso | Resultado exigido |
|---|---|
| Dos clientes y una unidad | Un canje, stock0, una sola deducción de puntos; el otro cliente recibe premio no disponible. |
| Misma solicitud simultánea | Ambos clientes reciben el mismo identificador; un canje y una sola deducción de puntos/stock. |
| Entrega y devolución simultáneas | Un único estado final: entregado sin reintegro o cancelado con puntos/stock restituidos una vez. Cuatro carreras. |

Son seis carreras sobre tres casos. Todas pasaron en el job140282067251 del run45930596215, commit60ef13ceb355f81ccddb79d6bffbecf95c4678a2. El registro resumido está en RESULTADOS-POSTGRES-3.5.1.txt. La función auth.uid() se simula en la base efímera; esto no acredita un recorrido con JWT reales ni una prueba de carga.

## Revisar las pruebas remotas

1. Abre https://github.com/ssavin05/Centro-I.A/pull/1 y entra a Checks.
2. Comprueba los trabajos Comprobar código y seguridad del repositorio y Comprobar contención PostgreSQL 17 de la revisión que consultes.
3. Abre el run de GitHub Actions. El artefacto centro-ia-sitio seguido del commit contiene el frontend construido. El enlace necesita acceso al repositorio y caduca a los siete días.
4. Revisa el estado antes de publicar: un artefacto o una rama no equivalen a una web desplegada.

## Repetir la prueba nativa como desarrollador

Necesitas Node.js 22.13 o posterior, psql y un PostgreSQL 17 de pruebas en127.0.0.1:55432. El workflow .github/workflows/ci.yml configura ese entorno. No uses una URL de Supabase ni una base con datos reales.

Define CIA_NATIVE_TEST=1, PGHOST=127.0.0.1, PGPORT=55432, PGUSER y PGPASSWORD del servidor efímero. Ejecuta node scripts/verify-postgres.mjs. El script crea una base cia_verify_ con un identificador aleatorio, aplica las migraciones y genera fixtures en esa base. Al finalizar elimina solo la base que acaba de crear. Rechaza destinos remotos y otro puerto antes de abrir psql.

El resultado correcto imprime tres líneas PASS y PostgreSQL 17:contención comprobada con conexiones independientes. Las pruebas generales siguen con node scripts/verify.mjs.

## Abrir la aplicación

Extrae el ZIP completo. Si faltan dependencias, ejecuta INSTALAR-DEPENDENCIAS.bat con conexión a Internet. Con Node.js 22.13 o posterior, ejecuta INICIAR-Cia.IA.3.5.1.bat y abre http://127.0.0.1:4178/workspace.html?as=user. Comprueba PRUEBA LOCAL. Conserva la ventana abierta. La base de ejemplo permanece separada del código y de Supabase.

## Supabase y publicación

Proyecto confirmado:huqspupbhhqilxeizklr, PostgreSQL 17.11. Antes del intento Growth se comprobaron2perfiles,0programas,0membresías y0canjes;21tablas con RLS. No se insertaron ejemplos ni se cambiaron datos de producción.

La revisión automática rechazó apply_migration para Growth 3.4:la autorización explícita anterior cubría el núcleo, no esta ampliación persistente de tablas/funciones/triggers. Se solicitó autorización específica y no se intentó aplicar por otra vía. Continúa preparada en supabase/migrations/20261125201344_growth_34.sql. No se ha publicado el frontend ni se ha integrado el PR.

Los advisors anteriores al intento conservan34advertencias de funciones SECURITY DEFINER autenticadas,7avisos informativos de tablas con RLS sin políticas directas y protección de contraseñas filtradas desactivada. El acceso por RPC es deliberado y requiere revisión; no se declara una auditoría integral.

## Pendientes de desarrollo

Activar y comprobar Growth después de autorización específica; validar cuentas/JWT reales; preparar la publicación efectiva, piloto físico, carga y contención de agenda. Permanecen los pendientes técnicos de 3.4 salvo el respaldo de código y los tres casos de contención aquí comprobados. Las pruebas de PostgreSQL no acreditan concurrencia integral de todos los módulos.

## Al final: participación del titular

Autorizar o rechazar Growth 3.4 en la solicitud pendiente. Proporcionar contenido/condiciones reales y validar el piloto con cuentas y dispositivos propios, como recoge TAREAS-DEL-TITULAR-3.4.md. El trabajo técnico permanece a cargo de desarrollo.

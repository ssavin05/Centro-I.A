# Centro I.A. — Auditoría de interfaz y calidad

**Alcance:** demo comercial (index.html), vista Cliente/Empresa (dashboard.html), HTML/CSS/JS, servidor Node.js local y despliegue GitHub Pages. 
**Método:** Impeccable (motion, polish y craft floor); Skills de Desarrollo y Diseño (improve-app, improve-code-quality e improve-website). Este documento recoge hallazgos verificables del prototipo, no datos reales de uso.

## Trabajo realizado en esta entrega

- [x] Sección interactiva para explicar visita → puntos → recompensa, con controles accesibles y datos indicados como simulación.
- [x] Sección de ideas de fidelización por tipo de negocio: cafetería, belleza y bienestar; actualiza el contenido sin recargar.
- [x] Capa visual de microinteracciones separada de CSS principal (`experience.css` y `dashboard-effects.css`), para mantener el sistema sin seguir acumulando cambios en los componentes base.
- [x] Pausa del movimiento ambiental cuando la pestaña está oculta y reducción de movimiento conforme a preferencias del usuario.
- [x] Navegación del recorrido con flechas y teclas Inicio/Fin para teclado.
- [x] Búsqueda del modo Usuario tolerante a cambios de pantalla: no falla si el contenedor de resultados deja de existir.
- [x] Tests de regresión para ambas interacciones y validación GitHub Pages en `npm run verify`.

## Diagnóstico y oportunidades

| Prioridad | Hallazgo | Acción recomendada | Impacto |
|---|---|---|---|
| P0 | La demo GitHub Pages aún usa datos locales y no sincroniza cuentas entre dispositivos | Integrar un único frontend con las API del servidor desplegado y sesiones reales | Operaciones fiables |
| P0 | El servidor local y el cliente publicado constituyen productos parcialmente desconectados | Definir contrato de API/versionado, adaptar pantallas y probar operaciones desde dos cuentas | Evitar promesas falsas |
| P1 | `app.js` concentra navegación, datos simulados, mutaciones, presentación y eventos | Extraer almacenamiento, dominio, acciones, UI y utilidades en módulos, con tests antes de cada refactor | Mantenibilidad |
| P1 | Hay estilos de producto concentrados en hojas extensas | Consolidar tokens y eliminar reglas duplicadas sólo tras snapshots visuales | Consistencia |
| P1 | No hay suite de pruebas de accesibilidad real ni capturas visuales automatizadas | Añadir flujos Playwright y axe-core: teclado, contraste, móvil, zoom | Confianza |
| P1 | El modo Empresa presenta numerosos componentes en una sola superficie | Priorización contextual: tareas frecuentes arriba; filtros y análisis avanzados por demanda | Menor carga cognitiva |
| P2 | Los ejemplos ilustrativos pueden confundirse con métricas reales | Mantener etiquetas visibles de simulación en gráfica, puntos y promociones | Transparencia |
| P2 | Carga de tipografías desde proveedor externo | Implementar `font-display: swap`, fallback estable y revisar medidas en redes lentas | Mejor carga |
| P2 | El hero y las tarjetas ocupan mucho espacio en celular | Reducir densidad ornamental y mantener CTA visible temprano | Conversión |

## Funciones nuevas a considerar (no implementadas)

1. **[P1] Configurador de reglas de fidelización** por negocio y sucursal (puntos por visita/compra, vigencia, topes).
2. **[P1] Línea del tiempo del cliente**, con visitas, puntos, cupones, reservas y consentimiento en una sola vista.
3. **[P1] Bandeja de acciones del negocio**, mostrando recompensas pendientes, próximas reservas y clientes por atender.
4. **[P1] Centro de notificaciones reales** con preferencias y desactivación por canal.
5. **[P2] Constructor de campañas** con segmentos, vista previa, aprobación y estadísticas por canal; envíos externos sólo después de configuración y consentimiento.
6. **[P2] Programa de referidos verificables**, con prevención de autocanje y abuso.
7. **[P2] Comparación entre sucursales**, con métricas basadas exclusivamente en eventos del servidor.
8. **[P2] Recomendaciones de IA** que expliquen la fuente de datos y soliciten aprobación antes de actuar.

## Orden de desarrollo recomendado

1. Proteger comportamiento actual con pruebas de interfaz y flujos reales.
2. Conectar la app a la API y base de datos alojadas en un entorno seguro.
3. Separar `app.js` por dominio y consolidar tokens CSS sin cambiar comportamiento.
4. Lanzar piloto con negocios reales para validar onboarding, recompensas y reservas.
5. Añadir campañas automatizadas, IA y suscripciones después de disponer de métricas reales.

**Limitación:** esta entrega mejora diseño y robustez de la demo. No convierte GitHub Pages en un servidor de cuentas, pagos o notificaciones reales.
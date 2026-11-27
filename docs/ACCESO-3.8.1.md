# Corrección de acceso 3.8.1

Problema informado: Crear cuenta e Iniciar sesión permanecen en Procesando. La página pública respondió correctamente a una prueba de credenciales inválidas; no se reprodujo la espera permanente en ese intento. Proyecto Supabase activo y sin avisos de salud. No se accedió a contraseñas ni se crearon cuentas de prueba en producción.

Se corrigieron dos esperas sin cobertura completa: el timeout de fetch terminaba al recibir cabeceras y dejaba sin límite la lectura del cuerpo Auth; el controlador esperaba indefinidamente si el SDK no resolvía. Ahora el abort de15segundos permanece hasta consumir la respuesta JSON de Auth y cada operación del SDK tiene un límite de20segundos.

Ante una respuesta incierta se informa que pudo haberse procesado, se ofrece Recargar acceso y no se vuelve a enviar automáticamente. El formulario deja aria-busy=false; la recarga es una acción explícita. Se conserva el correo hasta recargar y se ignoran resultados tardíos de la operación vencida. La inicialización y la entrada al espacio personal (sesión/perfil) también tienen salida de recuperación. Las respuestas que no son Auth conservan su streaming anterior.

El aviso de confirmar correo, y los errores, reciben foco para quedar visibles. No se desactiva confirmación, no se cambian RLS, contraseñas o configuración privada de Supabase y no se afirma entrega de correo.

Verificación:124/124 pruebas completas,43pruebas afectadas. Incluye cuerpo Auth bloqueado después de cabeceras, cancelación del llamador, estado/cabeceras/JSON de error preservados, inicialización y envío sin resolver, ausencia de doble envío y éxito tardío ignorado. Navegador local con respuestas simuladas: bloqueo real de20segundos pasa a Recargar acceso; recargar devuelve el formulario habilitado; registro sin sesión muestra el aviso enfocado en móvil. Sin overflow o errores observados en esas vistas. Capturas locales en .impeccable/review/v381.

Se requiere que el titular pruebe su cuenta y confirme su correo cuando se solicite. Las pruebas simuladas no acreditan un acceso válido a su cuenta, entrega de correo ni reproducen la causa de transporte concreta de su navegador. Publicación se comprueba después de CI y Pages, con reporte de archivos públicos.

export const businessProfiles={
 salon:{label:'Peluquería y belleza',catalog:'Servicios',item:'servicio',calendar:'Agenda de citas',resource:'Profesional o silla',description:'Cortes, tratamientos y servicios con duración.',suggestedPoints:10,rewardHint:'Servicio complementario, tratamiento o descuento en tu siguiente visita.',categories:['Cortes','Color','Tratamientos','Estética']},
 food:{label:'Restaurante y cafetería',catalog:'Menú',item:'producto',calendar:'Reservas',resource:'Mesa o zona',description:'Platillos, bebidas y especiales por categoría.',suggestedPoints:10,rewardHint:'Bebida, postre, combinación o experiencia de degustación.',categories:['Bebidas','Alimentos','Postres','Especiales']},
 retail:{label:'Comercio y tienda',catalog:'Catálogo',item:'producto',calendar:'Atención en tienda',resource:'Mostrador o asesor',description:'Productos, colecciones y atención personalizada.',suggestedPoints:15,rewardHint:'Producto, descuento o acceso a una colección.',categories:['Productos','Colecciones','Accesorios']},
 wellness:{label:'Bienestar',catalog:'Tratamientos',item:'servicio',calendar:'Agenda de sesiones',resource:'Cabina o especialista',description:'Sesiones, tratamientos y paquetes de bienestar.',suggestedPoints:15,rewardHint:'Sesión adicional o complemento de bienestar.',categories:['Sesiones','Tratamientos','Paquetes']},
 fitness:{label:'Gimnasio y actividad',catalog:'Clases y servicios',item:'servicio',calendar:'Calendario de clases',resource:'Sala o entrenador',description:'Clases, sesiones y actividades.',suggestedPoints:10,rewardHint:'Clase especial, sesión personalizada o acceso a una actividad.',categories:['Clases','Entrenamiento','Actividades']},
 professional:{label:'Servicios profesionales',catalog:'Servicios',item:'servicio',calendar:'Agenda de atención',resource:'Asesor o área',description:'Consultas, asesorías y servicios especializados.',suggestedPoints:20,rewardHint:'Servicio adicional, consulta o beneficio para clientes frecuentes.',categories:['Consultas','Asesorías','Servicios']},
 organization:{label:'Organización y administración',catalog:'Servicios y beneficios',item:'servicio',calendar:'Calendario de atención',resource:'Sede, área o responsable',description:'Atención por áreas y beneficios para la comunidad.',suggestedPoints:10,rewardHint:'Beneficio, experiencia o reconocimiento de participación.',categories:['Atención','Beneficios','Actividades']},
 other:{label:'Otro tipo de negocio',catalog:'Catálogo',item:'producto',calendar:'Calendario',resource:'Área de atención',description:'Personaliza productos, servicios y beneficios.',suggestedPoints:10,rewardHint:'Elige un premio que tus clientes quieran disfrutar.',categories:['General']}
};
export const themes={
 midnight:{label:'Azul noche',deep:'#102a43',accent:'#edc77d',soft:'#e1eef7'},
 ocean:{label:'Azul océano',deep:'#123e5b',accent:'#e9c788',soft:'#dceefa'},
 sky:{label:'Azul claro',deep:'#244d6a',accent:'#edc77d',soft:'#edf6fc'},
 gold:{label:'Dorado profundo',deep:'#142f46',accent:'#d9af63',soft:'#f8f1e5'}
};
export const rewardKinds={product:'Producto',discount:'Descuento',service:'Servicio',experience:'Experiencia',gift:'Regalo'};
export const promotionKinds={discount:'Descuento',bundle:'Paquete',special:'Especial',announcement:'Novedad'};
export const appointmentStates={requested:'Por confirmar',confirmed:'Confirmada',completed:'Completada',cancelled:'Cancelada'};
export const defaultStudioSettings={business_kind:'other',business_scale:'independent',theme:'midnight',timezone:'America/Tijuana',logo_data:'',booking_enabled:false,phone:'',address:'',hours:''};
export const profileFor=kind=>businessProfiles[kind]||businessProfiles.other;
export function loyaltyLevel(visits){const n=Number(visits||0);return n>=10?{label:'Preferente',next:null,remaining:0}:n>=3?{label:'Habitual',next:'Preferente',remaining:10-n}:{label:'Explorador',next:'Habitual',remaining:3-n};}
export function challengeProgress(challenge,visits=[],claims=[],userId,serverTime=new Date().toISOString()){
 const count=challenge.progress_count!==undefined?Number(challenge.progress_count):visits.filter(v=>v.club_id===challenge.club_id&&v.user_id===userId&&v.confirmed_at&&Date.parse(v.arrived_at)>=Date.parse(challenge.starts_at)&&Date.parse(v.arrived_at)<=Date.parse(challenge.ends_at)).length;
 const claimed=claims.some(c=>c.challenge_id===challenge.id&&c.user_id===userId);
 const active=challenge.active&&Date.parse(serverTime)>=Date.parse(challenge.starts_at)&&Date.parse(serverTime)<=Date.parse(challenge.ends_at);
 return {count,claimed,active,remaining:Math.max(0,challenge.target_visits-count),canClaim:!claimed&&active&&count>=challenge.target_visits};
}
export function studioError(error){
 const messages={invalid_settings:'Revisa el giro, el tema y la zona horaria.',invalid_logo:'Usa una imagen PNG, JPG o WEBP válida.',invalid_catalog:'Revisa los datos del catálogo; no se guardó el lote.',invalid_promotion:'Revisa el tipo, valor y fechas de la promoción.',invalid_adjustment:'Indica una cantidad de puntos válida y un motivo de al menos tres caracteres.',negative_balance:'El ajuste dejaría un saldo negativo. Revisa la cantidad.',member_unavailable:'El cliente ya no está disponible en este programa.',appointment_conflict:'Ese recurso ya tiene una cita confirmada en ese horario. Elige otro horario o recurso.',bookings_disabled:'Este negocio todavía no recibe solicitudes de citas.',invalid_appointment:'Revisa el título, fecha, hora y duración de la cita.',invalid_appointment_state:'La cita ya no permite ese cambio de estado.',challenge_incomplete:'Todavía faltan visitas confirmadas para completar el reto.',challenge_unavailable:'Este reto no está disponible en este momento.',notice_not_owned:'Esta notificación no pertenece a tu cuenta.',request_conflict:'La solicitud cambió. Actualiza el estado antes de volver a intentarlo.'};
 return messages[error?.message]||'No pudimos guardar el cambio. Revisa la conexión y los campos; tus datos siguen en el formulario.';
}
export function catalogRowErrors(row){
 const errors=[];if(typeof row.title!=='string'||row.title.trim().length<2||row.title.length>120)errors.push('nombre de 2 a 120 caracteres');
 if(!Number.isFinite(Number(row.price))||Number(row.price)<0||Number(row.price)>10000000)errors.push('precio válido');
 if(!['MXN','USD','EUR'].includes(row.currency))errors.push('moneda MXN, USD o EUR');
 if(!['product','service'].includes(row.item_kind))errors.push('tipo producto o servicio');
 if(row.duration_minutes!==null&&row.duration_minutes!==''&&(!Number.isInteger(Number(row.duration_minutes))||row.duration_minutes<5||row.duration_minutes>1440))errors.push('duración de 5 a 1440 minutos');
 return errors;
}
export function localDateTime(value){const date=new Date(value);return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);}

import {createLoyaltyPreview} from './loyalty-preview.mjs';
try {
 const app=await createLoyaltyPreview({port:Number(process.env.PORT||4176)});
 console.log('\nCENTRO I.A. 3.3 · PRUEBA LOCAL AISLADA\n');
 console.log('Empresa: http://127.0.0.1:'+app.port+'/workspace.html?as=company');
 console.log('Usuario: http://127.0.0.1:'+app.port+'/workspace.html?as=user');
 console.log('\nConserva esta ventana abierta. Ctrl+C detiene la aplicación.\nNo usa cuentas reales ni se conecta a Supabase.\n');
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0);});
} catch(error) {
 console.error(error.code==='EADDRINUSE'?'El puerto ya está ocupado. Si Centro I.A. ya está abierto, usa el enlace existente. También puedes definir PORT con otro puerto.':'No pudimos iniciar la prueba local. Comprueba Node >=22.13, las dependencias instaladas y que no haya otra copia usando la misma carpeta de datos.');
 process.exitCode=1;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCSV,parseNumber,parseCatalogText} from '../catalog-import.js';
import {challengeProgress,loyaltyLevel,catalogRowErrors} from '../studio-rules.js';
test('3.2: CSV con BOM, separador regional, comillas y saltos de línea',()=>{
 const data=parseCatalogText('\ufeffNombre;Precio;Descripción;Tipo;Duración\r\n"Corte; especial";"250,50";"Incluye\ntratamiento";servicio;45');
 assert.equal(data.rows.length,1);assert.equal(data.rows[0].title,'Corte; especial');assert.equal(data.rows[0].price,250.5);assert.equal(data.rows[0].description,'Incluye\ntratamiento');assert.equal(data.rows[0].duration_minutes,45);assert.equal(data.errors.length,0);
 assert.throws(()=>parseCSV('nombre,precio\n"sin cerrar,10'),/comillas/);
});
test('3.2: precios regionales, JSON, texto y errores revisables',()=>{
 assert.equal(parseNumber('$1,250.75'),1250.75);assert.equal(parseNumber('1.250,75 EUR'),1250.75);
 const data=parseCatalogText(JSON.stringify({servicios:[{nombre:'Masaje',precio:-5,tipo:'servicio',duracion:30}]}),'json');
 assert.equal(data.errors.length,1);assert.match(data.errors[0].errors.join(','),/precio/);
 assert.equal(parseCatalogText('Café de olla $45.00\nSin precio','txt').rows[0].title,'Café de olla');
 assert.throws(()=>parseCatalogText('{}','json'),/lista/);
 assert.equal(catalogRowErrors({title:'Corte',price:10,currency:'MXN',item_kind:'service',duration_minutes:2}).length,1);
});
test('3.2: importar limita a 250 filas y conserva advertencia',()=>{
 const rows=Array.from({length:251},(_,i)=>({nombre:'Producto '+i,precio:i}));
 const data=parseCatalogText(JSON.stringify(rows),'json');assert.equal(data.rows.length,250);assert.equal(data.warnings.length,1);
});
test('3.2: niveles y retos comparan instantes con zonas distintas',()=>{
 assert.equal(loyaltyLevel(0).label,'Explorador');assert.equal(loyaltyLevel(3).label,'Habitual');assert.equal(loyaltyLevel(10).label,'Preferente');
 const challenge={id:'h',club_id:'c',active:true,target_visits:1,starts_at:'2026-01-01T00:00:00+00:00',ends_at:'2026-01-02T00:00:00+00:00'};
 const visits=[{club_id:'c',user_id:'u',arrived_at:'2025-12-31T20:00:00-08:00',confirmed_at:'2026-01-01T04:00:00Z'}];
 assert.equal(challengeProgress(challenge,visits,[],'u','2026-01-01T04:00:00Z').canClaim,true);
 assert.equal(challengeProgress(challenge,visits,[{challenge_id:'h',user_id:'u'}],'u','2026-01-01T04:00:00Z').canClaim,false);
 assert.equal(challengeProgress({...challenge,progress_count:0},visits,[],'u','2026-01-01T04:00:00Z').count,0);
});
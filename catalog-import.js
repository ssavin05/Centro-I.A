import {catalogRowErrors} from './studio-rules.js';
const clean=value=>String(value??'').trim();
const key=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const names={title:['title','name','nombre','producto','servicio','platillo','articulo'],description:['description','descripcion','detalle','detalles'],category:['category','categoria','grupo','seccion'],price:['price','precio','importe','costo','coste'],currency:['currency','moneda'],duration_minutes:['duration','duracion','minutos','durationminutes'],item_kind:['kind','tipo','itemkind'],active:['active','activo','disponible']};
export function parseNumber(value){
 let text=clean(value).replace(/[^0-9.,-]/g,'');if(!text)return 0;
 if(text.includes(',')&&text.includes('.')){if(text.lastIndexOf(',')>text.lastIndexOf('.'))text=text.replaceAll('.','').replace(',','.');else text=text.replaceAll(',','');}
 else if(text.includes(',')){text=/,\d{1,2}$/.test(text)?text.replace(',','.'):text.replaceAll(',','');}
 return Number(text);
}
export function parseCSV(text,delimiter){
 text=String(text).replace(/^\uFEFF/,'');
 if(!delimiter){const line=text.split(/\r?\n/)[0]||'';delimiter=[';',',','\t','|'].sort((a,b)=>line.split(b).length-line.split(a).length)[0];}
 const rows=[];let row=[],value='',quoted=false;
 for(let i=0;i<text.length;i++){
  const char=text[i];if(char==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
  else if(char===delimiter&&!quoted){row.push(value);value='';}
  else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[i+1]==='\n')i++;row.push(value);if(row.some(v=>v.trim()))rows.push(row);row=[];value='';if(rows.length>1000)throw Error('El archivo supera 1000 filas. Divídelo en partes.');}
  else value+=char;
 }
 if(quoted)throw Error('Hay comillas sin cerrar en el archivo CSV.');
 row.push(value);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
function normalizeRecord(record,kind='product'){
 const pick=field=>{const found=Object.keys(record).find(k=>names[field].includes(key(k)));return found===undefined?'':record[found];};
 const rawKind=key(pick('item_kind')),rawActive=key(pick('active'));
 return {title:clean(pick('title')).slice(0,120),description:clean(pick('description')).slice(0,1000),category:clean(pick('category')).slice(0,80)||'General',price:parseNumber(pick('price')),currency:clean(pick('currency')).toUpperCase()||'MXN',item_kind:['servicio','service'].includes(rawKind)?'service':['producto','product'].includes(rawKind)?'product':kind,duration_minutes:clean(pick('duration_minutes'))?Number(pick('duration_minutes')):null,active:!['false','no','0','inactivo'].includes(rawActive)};
}
export function rowsFromMatrix(matrix,kind='product'){
 if(!matrix.length)return [];
 const first=matrix[0].map(key),hasHeader=first.some(h=>names.title.includes(h))&&first.some(h=>[...names.price,...names.description,...names.category].includes(h));
 const headers=hasHeader?matrix[0]:matrix[0].length===2?['nombre','precio']:['nombre','descripcion','precio','categoria'];
 return matrix.slice(hasHeader?1:0).filter(row=>row.some(v=>clean(v))).map(row=>normalizeRecord(Object.fromEntries(headers.map((h,i)=>[h,row[i]??''])),kind));
}
export function rowsFromText(text,kind='product'){
 const lines=String(text).split(/\r?\n/).map(clean).filter(Boolean),rows=[];
 for(const line of lines){const match=line.match(/^(.{2,120}?)\s+(?:\$\s*|MXN\s*)?(-?\d[\d.,]*)(?:\s*(MXN|USD|EUR))?$/i);if(match)rows.push(normalizeRecord({nombre:match[1],precio:match[2],moneda:match[3]||'MXN'},kind));}
 return rows;
}
export function parseCatalogText(text,extension='csv',kind='product'){
 let rows;
 if(extension==='json'){let data;try{data=JSON.parse(text);}catch{throw Error('El JSON no tiene una estructura válida.');}if(!Array.isArray(data))data=data.items||data.catalog||data.productos||data.servicios;if(!Array.isArray(data))throw Error('El JSON debe contener una lista de productos o servicios.');rows=data.map(r=>normalizeRecord(r,kind));}
 else if(extension==='csv'||extension==='tsv')rows=rowsFromMatrix(parseCSV(text,extension==='tsv'?'\t':undefined),kind);
 else rows=rowsFromText(text,kind);
 return finish(rows);
}
function finish(rows){
 if(!rows.length)throw Error('No detectamos filas con nombre y precio. Usa el CSV de ejemplo o agrega elementos manualmente.');
 const warnings=[];if(rows.length>250)warnings.push('Se muestran las primeras 250 filas. Divide el resto en otro archivo.');
 rows=rows.slice(0,250);
 return {rows,warnings,errors:rows.map((row,i)=>({row:i+1,errors:catalogRowErrors(row)})).filter(r=>r.errors.length)};
}
function htmlMatrix(text){
 const doc=new DOMParser().parseFromString(text,'text/html');for(const el of doc.querySelectorAll('script,style,iframe,object,embed,link,img'))el.remove();
 const matrix=Array.from(doc.querySelectorAll('table tr')).map(tr=>Array.from(tr.querySelectorAll('th,td')).map(td=>td.textContent.trim()));
 return matrix.length?matrix:null;
}
export async function importCatalogFile(file,kind='product'){
 if(!file||file.size>10*1024*1024)throw Error('El archivo debe pesar como máximo 10 MB.');
 const extension=file.name.split('.').at(-1).toLowerCase();
 if(['csv','tsv','json','txt','md'].includes(extension))return parseCatalogText(await file.text(),extension,kind);
 if(['html','htm'].includes(extension)){const text=await file.text(),matrix=htmlMatrix(text);return matrix?finish(rowsFromMatrix(matrix,kind)):finish(rowsFromText(new DOMParser().parseFromString(text,'text/html').body.textContent,kind));}
 if(extension==='docx'){
  const {unzipSync,strFromU8}=await import('./vendor/fflate.js');
  const archive=unzipSync(new Uint8Array(await file.arrayBuffer()),{filter:entry=>entry.name==='word/document.xml'&&entry.originalSize<=2*1024*1024});
  if(!archive['word/document.xml'])throw Error('El DOCX no contiene texto compatible o es demasiado grande.');
  const doc=new DOMParser().parseFromString(strFromU8(archive['word/document.xml']),'application/xml');
  const matrix=Array.from(doc.getElementsByTagNameNS('*','tr')).map(tr=>Array.from(tr.getElementsByTagNameNS('*','tc')).map(td=>Array.from(td.getElementsByTagNameNS('*','t')).map(t=>t.textContent).join(' ')));
  if(matrix.length)return finish(rowsFromMatrix(matrix,kind));
  const text=Array.from(doc.getElementsByTagNameNS('*','p')).map(p=>Array.from(p.getElementsByTagNameNS('*','t')).map(t=>t.textContent).join(' ')).join('\n');
  return finish(rowsFromText(text,kind));
 }
 if(extension==='pdf'){
  const pdfjs=await import('./vendor/pdf/pdf.js');pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdf/pdf.worker.js',import.meta.url).href;
  const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,enableXfa:false,disableAutoFetch:true});
  let pdf;try{
   pdf=await task.promise;if(pdf.numPages>50)throw Error('El PDF debe tener como máximo 50 páginas.');
   const lines=[];for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const text=await page.getTextContent();const groups=new Map();for(const item of text.items){if(!item.str)continue;const y=Math.round(item.transform?.[5]||0);if(!groups.has(y))groups.set(y,[]);groups.get(y).push({x:item.transform?.[4]||0,text:item.str});}for(const [,items]of [...groups.entries()].sort((a,b)=>b[0]-a[0]))lines.push(items.sort((a,b)=>a.x-b.x).map(x=>x.text).join(' '));page.cleanup();}
   const parsed=finish(rowsFromText(lines.join('\n'),kind));parsed.warnings.push('La extracción del PDF es aproximada. Revisa nombres, precios y categorías antes de guardar.');return parsed;
  }catch(error){if(error.name==='PasswordException')throw Error('El PDF está protegido con contraseña. Exporta una copia sin protección.');if(!pdf)throw Error('No pudimos abrir ese PDF. Usa una copia con texto o un archivo CSV.');throw error;}
  finally{await task.destroy();}
 }
 throw Error('Formato no compatible. Usa CSV, TSV, JSON, HTML, TXT, Markdown, DOCX o PDF con texto. Los documentos escaneados necesitan captura manual.');
}
export async function normalizeLogo(file){
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024)throw Error('Usa un logo PNG, JPG o WEBP de hasta 5 MB.');
 const bitmap=await createImageBitmap(file);try{const ratio=Math.min(1,512/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const data=canvas.toDataURL('image/webp',.85);if(data.length>600000)throw Error('El logo sigue siendo demasiado grande. Usa una imagen más simple.');return data;}finally{bitmap.close();}
}

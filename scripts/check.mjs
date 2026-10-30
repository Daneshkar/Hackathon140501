import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {contract} from './contract.mjs';
const root=fileURLToPath(new URL('../docs/',import.meta.url));
const files=await readdir(root);let links=0;
for(const f of files.filter(f=>f.endsWith('.html'))){
  const html=await readFile(path.join(root,f),'utf8');
  assert.match(html,/<html lang="fa" dir="rtl">/);assert.match(html,/<main id="main">/);assert(!html.includes('undefined'));assert(!html.includes('�'));
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`duplicate IDs ${f}`);
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const url=match[1];if(/^(https?:|mailto:|data:)/.test(url))continue;
    const [file,fragment]=url.split('#');const target=path.resolve(root,file||f);assert(target.startsWith(root));assert((await stat(target)).isFile(),`broken link ${url}`);links++;
    if(fragment){const targetHtml=file?await readFile(target,'utf8'):html;assert(targetHtml.includes(`id="${fragment}"`),`broken anchor ${url}`);}
  }
}
const api=JSON.parse(await readFile(path.join(root,'api/openapi.json'),'utf8'));
assert.deepEqual(api,contract(),'generated OpenAPI is stale');
function walk(v){if(!v||typeof v!=='object')return; if(v.$ref){assert(v.$ref.startsWith('#/components/schemas/'));assert(api.components.schemas[v.$ref.split('/').at(-1)],`unresolved ${v.$ref}`);}Object.values(v).forEach(walk);}walk(api);
const ids=new Set();let operations=0;
for(const [p,methods] of Object.entries(api.paths))for(const [m,op] of Object.entries(methods)){assert(!ids.has(op.operationId));ids.add(op.operationId);operations++;if(op.security.length===0)assert(['/auth/register','/auth/login'].includes(p));for(const variable of p.matchAll(/\{([^}]+)\}/g))assert(op.parameters.some(x=>x.name===variable[1]&&x.in==='path'&&x.required));assert(op.responses['200']||op.responses['201']||op.responses['204']);}
const roadmap=JSON.parse(await readFile(new URL('../content/roadmap.json',import.meta.url),'utf8'));assert.deepEqual(roadmap.map(d=>d.day),Array.from({length:14},(_,i)=>i+1));for(const d of roadmap)await stat(path.join(root,d.page));
const scores=JSON.parse(await readFile(new URL('../content/scoring.json',import.meta.url),'utf8'));assert.equal(scores.base.reduce((s,r)=>s+r[1],0),100);assert.equal(scores.bonus.reduce((s,r)=>s+r[1],0),30);
console.log(`PASS: 9 RTL pages; ${links} local links; ${operations} API operations; 14 days; 100+30 points.`);

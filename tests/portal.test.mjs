import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {markdown} from '../scripts/markdown.mjs';
import {contract} from '../scripts/contract.mjs';
test('renderer escapes hostile content and renders scenario tables',()=>{const html=markdown('# عنوان\n\n<script>alert(1)</script>\n\n| الف | ب |\n|---|---|\n| ۱ | ۲ |');assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(html.includes('<th scope="col">الف</th>'));assert(!html.includes('<td>---</td>'));});
test('transaction contract requires price only on Buy/Sell and rejects client status',()=>{const s=contract().components.schemas.TransactionInput;assert.equal(s.additionalProperties,false);assert(!('status' in s.properties));assert.deepEqual(s.allOf[0].if.properties.type.enum,['Buy','Sell']);assert.deepEqual(s.allOf[0].then.required,['unitPriceUsd']);assert.deepEqual(s.allOf[0].else.not.required,['unitPriceUsd']);assert(!new RegExp(s.properties.quantity.pattern).test('0'));assert(!new RegExp(s.properties.quantity.pattern).test('-1'));assert(new RegExp(s.properties.quantity.pattern).test('0.4'));});
function portal(saved,failStorage=false){
  const days=JSON.parse(readFileSync(new URL('../content/roadmap.json',import.meta.url),'utf8'));
  const elements=new Map();const buttons=[];let storage=saved;
  function el(){return {textContent:'',value:0,checked:false,dataset:{},listeners:{},classList:{toggle(){}},addEventListener(n,fn){this.listeners[n]=fn;},replaceChildren(){},showModal(){this.open=true;},close(){this.open=false;this.listeners.close?.();},focus(){}};}
  for(const id of ['roadmap-data','storage-message','quest-dialog','quest-complete','progress','progress-text','quest-region','quest-title','quest-mission','quest-deliverable','quest-tasks','quest-resource','close-dialog','reset-progress','export-progress','import-progress'])elements.set(id,el());
  elements.get('roadmap-data').textContent=JSON.stringify(days);
  const stops=days.map(d=>{const x=el();x.dataset.day=String(d.day);x.querySelector=()=>el();const b=el();b.dataset.open=String(d.day);buttons.push(b);return x;});
  const document={getElementById:id=>elements.get(id),querySelectorAll:s=>s==='.stop'?stops:buttons,createElement:()=>el()};
  const localStorage={getItem:()=>{if(failStorage)throw Error();return storage;},setItem:(_,v)=>{if(failStorage)throw Error();storage=v;}};
  vm.runInNewContext(readFileSync(new URL('../docs/assets/app.js',import.meta.url),'utf8'),{document,localStorage,Intl,Set,JSON,Number,confirm:()=>true});
  return {elements,buttons,get saved(){return JSON.parse(storage);}};
}
test('quest selection, completion, reload, undo and reset preserve progress',()=>{const p=portal(null);p.buttons[3].listeners.click();assert.equal(p.elements.get('quest-title').textContent,'همراهان سفر');const cb=p.elements.get('quest-complete');cb.checked=true;cb.listeners.change();assert.deepEqual(p.saved.completedDays,[4]);assert.equal(p.elements.get('progress').value,1);const q=portal(JSON.stringify(p.saved));assert.equal(q.elements.get('progress').value,1);q.buttons[3].listeners.click();assert.equal(q.elements.get('quest-complete').checked,true);q.elements.get('quest-complete').checked=false;q.elements.get('quest-complete').listeners.change();assert.deepEqual(q.saved.completedDays,[]);p.elements.get('reset-progress').listeners.click();assert.equal(p.elements.get('progress').value,0);});
test('unavailable storage and malformed imported state do not break map',()=>{const p=portal(null,true);p.buttons[0].listeners.click();p.elements.get('quest-complete').checked=true;p.elements.get('quest-complete').listeners.change();assert.equal(p.elements.get('progress').value,1);assert.match(p.elements.get('storage-message').textContent,/ممکن نیست/);assert.equal(portal('{broken').elements.get('progress').value,0);assert.equal(portal(JSON.stringify({version:1,completedDays:[99]})).elements.get('progress').value,0);});

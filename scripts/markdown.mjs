export const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function inline(s) {
  const tokens=[];
  s=s.replace(/`([^`]+)`/g,(_,v)=>`\u0000${tokens.push(`<code dir="ltr">${escape(v)}</code>`)-1}\u0000`);
  s=escape(s).replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,'<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  return s.replace(/\u0000(\d+)\u0000/g,(_,i)=>tokens[i]);
}
export function markdown(source) {
  const lines=source.replace(/\r/g,'').split('\n'); const out=[]; let i=0;
  while(i<lines.length) {
    const l=lines[i].trim();
    if(!l){i++;continue;}
    if(l.startsWith('```')){const block=[];i++;while(i<lines.length&&!lines[i].startsWith('```'))block.push(lines[i++]);i++;out.push(`<pre dir="ltr"><code>${escape(block.join('\n'))}</code></pre>`);continue;}
    if(/^#{1,6} /.test(l)){const level=l.indexOf(' ');out.push(`<h${level}>${inline(l.slice(level+1))}</h${level}>`);i++;continue;}
    if(/^---+$/.test(l)){out.push('<hr>');i++;continue;}
    if(l.startsWith('|')){const rows=[];while(i<lines.length&&lines[i].trim().startsWith('|'))rows.push(lines[i++].trim().slice(1,-1).split('|').map(x=>x.trim()));const header=rows.shift();out.push(`<div class="table-wrap"><table><thead><tr>${header.map(c=>`<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.filter(r=>!r.every(c=>/^:?-+:?$/.test(c))).map(r=>`<tr>${r.map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;}
    if(/^- /.test(l)){const items=[];while(i<lines.length&&/^- /.test(lines[i].trim()))items.push(lines[i++].trim().slice(2));out.push(`<ul>${items.map(x=>`<li>${inline(x)}</li>`).join('')}</ul>`);continue;}
    if(/^\d+\. /.test(l)){const items=[];while(i<lines.length&&/^\d+\. /.test(lines[i].trim()))items.push(lines[i++].trim().replace(/^\d+\. /,''));out.push(`<ol>${items.map(x=>`<li>${inline(x)}</li>`).join('')}</ol>`);continue;}
    const p=[];while(i<lines.length&&lines[i].trim()&&!/^(#{1,6} |\||- |\d+\. |---)/.test(lines[i].trim()))p.push(lines[i++].trim());out.push(`<p>${inline(p.join(' '))}</p>`);
  }
  return out.join('\n');
}

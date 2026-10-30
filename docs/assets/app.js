(() => {
  'use strict';
  const days=JSON.parse(document.getElementById('roadmap-data').textContent);
  const key='daneshkar-hackathon-140501-progress-v1';
  const message=document.getElementById('storage-message');
  const dialog=document.getElementById('quest-dialog');
  const check=document.getElementById('quest-complete');
  const number=new Intl.NumberFormat('fa');
  let completed=new Set(),current=null,opener=null;
  const parse=value=>{
    if(!value||value.version!==1||!Array.isArray(value.completedDays)||value.completedDays.some(d=>!Number.isInteger(d)||d<1||d>14))throw new Error('invalid');
    return new Set(value.completedDays);
  };
  try{const saved=localStorage.getItem(key);if(saved)completed=parse(JSON.parse(saved));}catch{message.textContent='خواندن پیشرفت قبلی ممکن نشد؛ می‌توانید با دریافت پیشرفت نسخه پشتیبان بگیرید.';}
  function update(){
    document.getElementById('progress').value=completed.size;
    document.getElementById('progress-text').textContent=`${number.format(completed.size)} از ۱۴ مأموریت تکمیل شده${completed.size===14?'؛ به قلعهٔ تحویل رسیدید!':''}`;
    for(const el of document.querySelectorAll('.stop')){const done=completed.has(Number(el.dataset.day));el.classList.toggle('completed',done);el.querySelector('.quest-state').textContent=done?'تکمیل شده ✓':'مشاهدهٔ مأموریت';}
  }
  function save(){try{localStorage.setItem(key,JSON.stringify({version:1,completedDays:[...completed].sort((a,b)=>a-b)}));message.textContent='پیشرفت در همین مرورگر ذخیره شد.';}catch{message.textContent='ذخیره در مرورگر ممکن نیست؛ پیش از خروج، پیشرفت را دریافت کنید.';}update();}
  for(const button of document.querySelectorAll('[data-open]'))button.addEventListener('click',()=>{
    current=days.find(d=>d.day===Number(button.dataset.open));opener=button;
    document.getElementById('quest-region').textContent=`منطقهٔ ${current.region} / روز ${number.format(current.day)}`;
    document.getElementById('quest-title').textContent=current.title;
    document.getElementById('quest-mission').textContent=current.mission;
    document.getElementById('quest-deliverable').textContent=current.deliverable;
    const ul=document.getElementById('quest-tasks');ul.replaceChildren(...current.tasks.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
    document.getElementById('quest-resource').href=current.page;
    check.checked=completed.has(current.day);dialog.showModal();
  });
  check.addEventListener('change',()=>{if(!current)return;check.checked?completed.add(current.day):completed.delete(current.day);save();});
  document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>opener?.focus());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  document.getElementById('reset-progress').addEventListener('click',()=>{if(confirm('پیشرفت ذخیره‌شدهٔ چهارده روز پاک شود؟')){completed.clear();save();}});
  document.getElementById('export-progress').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,completedDays:[...completed].sort((a,b)=>a-b)},null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='daneshkar-progress.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  document.getElementById('import-progress').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>10000)throw new Error('large');const next=parse(JSON.parse(await file.text()));if(confirm('پیشرفت فعلی با فایل انتخاب‌شده جایگزین شود؟')){completed=next;save();}}catch{message.textContent='فایل معتبر نیست؛ JSON نسخه ۱ با completedDays شامل شماره روزهای ۱ تا ۱۴ لازم است.';}finally{event.target.value='';}
  });
  update();
})();

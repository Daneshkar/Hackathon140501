(() => {
  let opener;
  const dialog = document.querySelector('dialog');
  const features = fetch('assets/features.json?v=pdf1').then(r => { if (!r.ok) throw Error(); return r.json(); });
  features.catch(() => {});
  function section(title, items, className = '') {
    const container = document.createElement('section');
    container.className = className;
    const heading = document.createElement('h3'); heading.textContent = title;
    const list = document.createElement('ul');
    list.replaceChildren(...items.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
    container.append(heading, list); return container;
  }
  document.querySelectorAll('[data-feature]').forEach(button => button.addEventListener('click', async () => {
    try {
      const feature = (await features)[Number(button.dataset.feature)]; opener = button;
      const guide = feature[5];
      document.querySelector('#feature-title').textContent = feature[1];
      document.querySelector('#feature-score').textContent = `${feature[0]} · ${new Intl.NumberFormat('fa').format(feature[2])} امتیاز`;
      document.querySelector('#feature-description').textContent = guide?.goal || feature[3];
      const body = document.querySelector('#feature-details'); body.replaceChildren();
      if (guide) {
        if (guide.designs?.length) {
          const reference = document.createElement('section');
          const title = document.createElement('h3'); title.textContent = 'طراحی مرتبط در Figma'; reference.append(title);
          const images = guide.designs.filter(design => design.image);
          if (images.length) {
            const choices = document.createElement('div'); choices.className = 'design-choices';
            choices.setAttribute('role', 'group'); choices.setAttribute('aria-label', 'انتخاب تصویر طراحی');
            const figure = document.createElement('figure'); figure.className = 'design-preview';
            const full = document.createElement('a'); full.target = '_blank'; full.rel = 'noopener noreferrer';
            const image = document.createElement('img'); image.decoding = 'async';
            const caption = document.createElement('figcaption');
            full.append(image); figure.append(full, caption);
            const buttons = images.map(design => {
              const button = document.createElement('button'); button.type = 'button'; button.textContent = design.title;
              button.addEventListener('click', () => select(design)); choices.append(button); return button;
            });
            function select(design) {
              image.src = design.image; image.alt = 'طرح اصلی Figma؛ ' + design.title;
              image.width = design.width; image.height = design.height;
              full.href = design.image; full.setAttribute('aria-label', 'بازکردن تصویر کامل ' + design.title);
              caption.textContent = design.title + ' — برای دیدن اندازهٔ کامل روی تصویر بزنید.';
              buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(images[index] === design)));
            }
            select(images[0]); reference.append(choices, figure);
            const note = document.createElement('p'); note.className = 'design-note';
            note.textContent = 'این تصویر از خروجی طراحی است؛ اعداد نمونه‌اند و الزامی‌بودن قابلیت‌ها را توضیحات همین کارت مشخص می‌کند.';
            reference.append(note);
          }
          const sources = document.createElement('details');
          const sourceSummary = document.createElement('summary'); sourceSummary.textContent = 'بازکردن طراحی اصلی در Figma'; sources.append(sourceSummary);
          for (const design of guide.designs) {
            const link = document.createElement('a');
            link.href = 'https://www.figma.com/design/FB8p3t10nYItsCZtys3tG5/Daneshkar-Hackaton?node-id=' + encodeURIComponent(design.nodeId);
            link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = design.title + ' ↗';
            link.style.display = 'block'; sources.append(link);
          }
          reference.append(sources);
          body.append(reference);
        }
        body.append(section('چه چیزی پیاده‌سازی کنید؟', guide.build), section('قوانین مهم این بخش', guide.rules));
        const example = document.createElement('section'); example.className = 'guide-example';
        const heading = document.createElement('h3'); heading.textContent = 'یک مثال برای روشن‌شدن رفتار';
        const text = document.createElement('p'); text.textContent = guide.example;
        example.append(heading, text);
        body.append(example, section('چه زمانی این بخش کامل است؟', guide.acceptance));
        const api = document.createElement('details'); const summary = document.createElement('summary'); summary.textContent = 'مسیرهای API این بخش';
        api.append(summary, section('قرارداد پیشنهادی API', guide.endpoints, 'guide-api'));
        const link = document.createElement('a'); link.href = 'api.html'; link.textContent = 'مدل درخواست و پاسخ و قواعد مشترک ←';
        api.append(link); body.append(api);
      } else body.append(section('نیازمندی‌ها', feature[4]));
      dialog.showModal(); dialog.scrollTop = 0;
    } catch { location.href = 'scenario.html'; }
  }));
  document.querySelectorAll('.close,.close-bottom').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => opener?.focus());
})();

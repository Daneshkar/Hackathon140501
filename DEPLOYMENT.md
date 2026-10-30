# راهنمای انتشار و بازیابی

## مسیر اصلی GitHub Actions

1. PR تغییرات را با بررسی `Validate portal` ادغام کنید؛ force push به main انجام نشود.
2. Settings → Pages → Source را GitHub Actions انتخاب کنید، یا با مجوز مدیریت از REST، Pages با build_type برابر workflow فعال شود.
3. workflow انتشار روی push به main اجرا می‌شود؛ در صورت فعال‌سازی Pages بعد از push، از workflow_dispatch استفاده کنید.
4. موفقیت job deploy و environment برابر github-pages را بررسی کنید.
5. صفحه اصلی، scenario.html، api.html و api/openapi.json را از URL عمومی با HTTP 200 و محتوای صحیح بررسی کنید؛ وضعیت workflow به‌تنهایی بررسی بصری نیست.

مجوز لازم برای ثبت کد Contents:write و برای PR Pull requests:write است. افزودن فایل workflow از OAuth ممکن است scope جداگانه workflow بخواهد. مدیریت Pages نیز مجوز Pages یا مدیریت مناسب مخزن لازم دارد. مجوز انسانی Admin لزوماً به معنای مجوز نوشتن GitHub App نیست.

## مسیر جایگزین انتشار از پوشه docs

اگر محدودیت scope اجازه ثبت workflow نداد ولی ثبت سایر فایل‌ها ممکن بود، محتوای اعتبارسنجی‌شده docs را با PR ادغام کنید و Pages را Deploy from a branch با main و /docs فعال کنید. این روش همان خروجی ایستا را منتشر می‌کند. فایل workflow آماده باید همراه بسته تحویل حفظ و محدودیت آن صریح گزارش شود؛ موفقیت این مسیر جای ادعای ثبت workflow در GitHub را نمی‌گیرد.

## Rollback

به‌جای بازنویسی تاریخچه main، PR revert برای commit انتشار بسازید. بعد از ادغام، اجرای انتشار و محتوای عمومی را دوباره بررسی کنید. فایل‌های منبع و خروجی تولیدشده را هم‌زمان برگردانید.

## نگهداری

تغییرات content یا scenario-source یا contract را با build دوباره به docs منتقل کنید. `git diff --exit-code -- docs` بعد از build باید بدون اختلاف باشد. آدرس‌ها نسبی‌اند تا مسیر پروژه GitHub Pages کار کند. داده پیشرفت نسخه ۱ است و مستقل از نسخه منتشرشده در مرورگر باقی می‌ماند.

# منابع و پرسش‌های رایج

## مسیر مطالعه

ابتدا سناریو و قرارداد API را بخوانید؛ سپس به ترتیب احراز هویت، EF Core، transaction و authorization را مطالعه کنید. منابع رسمی زیر برای کار عملی مناسب‌اند؛ لازم نیست پیش از ساخت MVP تمام معماری‌های پیشرفته را یاد بگیرید.

- [آموزش Web API در ASP.NET Core](https://learn.microsoft.com/aspnet/core/tutorials/first-web-api)
- [مستندات Entity Framework Core](https://learn.microsoft.com/ef/core/)
- [Transaction در EF Core](https://learn.microsoft.com/ef/core/saving/transactions)
- [مدیریت تعارض هم‌زمانی](https://learn.microsoft.com/ef/core/saving/concurrency)
- [Authorization در ASP.NET Core](https://learn.microsoft.com/aspnet/core/security/authorization/introduction)
- [تست یکپارچه ASP.NET Core](https://learn.microsoft.com/aspnet/core/test/integration-tests)
- [مشخصات OpenAPI](https://spec.openapis.org/oas/v3.1.0.html)
- [انتشار GitHub Pages با workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## آیا به Blockchain یا پرداخت واقعی نیاز است؟

خیر. تمام عملیات، ثبت شبیه‌سازی‌شده در دفتر دارایی است؛ هیچ کلید خصوصی، صرافی یا انتقال واقعی لازم نیست.

## آیا دریافت قیمت زنده اجباری است؟

خیر. پایه از قیمت و تاریخچه Seed در دیتابیس استفاده می‌کند که از API خود تیم خوانده می‌شود. اتصال به سرویس عمومی بازار امتیاز ویژه دارد.

## Clean Architecture و CQRS اجباری‌اند؟

خیر؛ امتیاز ویژه دارند. ابتدا قابلیت اصلی کامل و صحیح را بسازید. صرف ایجاد پوشه یا نصب کتابخانه امتیاز کامل نمی‌آورد.

## پیشرفت نقشه برای تیم ذخیره می‌شود؟

پیشرفت این پرتال فقط در مرورگر همین دستگاه ذخیره می‌شود؛ ارسال به سرور و حساب تیمی ندارد. می‌توانید JSON خروجی بگیرید و در دستگاه دیگر وارد کنید. پاک‌کردن داده مرورگر پیشرفت را حذف می‌کند.

## آیا پرتال Backend آماده تحویل است؟

خیر. این سایت مرجع مطالعه و قرارداد پروژه است. اجرای API و دیتابیس و اتصال Frontend وظیفه شرکت‌کنندگان است.

# راهنمای طراحی Backend

## مدل داده و قیود

- User: ایمیل و موبایل نرمال‌شده یکتا، PasswordHash با ASP.NET Core Identity یا ابزار استاندارد؛ هرگز الگوریتم هش دست‌ساز نسازید.
- WorkspaceMember: زوج WorkspaceId و UserId یکتا، Role و Status؛ حذف عضویت نباید Transaction را cascade delete کند.
- Invitation: workspaceId، email نرمال‌شده، role، tokenHash یکتا، expiresAt، consumedAt؛ مصرف همراه ایجاد عضویت در transaction دیتابیس.
- Asset: symbol یکتا؛ AssetPriceSnapshot: assetId و observedAt با index؛ داده نمونه با منشأ مشخص.
- Holding: زوج WorkspaceId و AssetId یکتا؛ quantity با decimal(28,8) و check غیرمنفی.
- Transaction: workspaceId، holding/assetId، createdBy، quantity، type، status، createdAt، unitPriceUsd و totalValueUsd. index ترکیبی WorkspaceId و CreatedAt.
- Watchlist: UserId و AssetId یکتا؛ UserSettings: یک رکورد برای هر User؛ PortfolioSnapshot: WorkspaceId و observedAt و ارزش دلاری، برچسب نمونه برای حساب seed.

## مرز یکپارچگی

در ثبت تراکنش، اعتبارسنجی مقدار و دسترسی، کنترل موجودی، تغییر Holding و ایجاد Transaction در یک transaction دیتابیس انجام شود. در شکست هر مرحله rollback لازم است. در تمام queryها WorkspaceId را از context معتبر اعمال کنید؛ lookup صرف با id کافی نیست.

پایه نیازمند حفظ یکپارچگی و جلوگیری از موجودی منفی است. برای امتیاز پیشرفته، رقابت دو برداشت هم‌زمان و retry را با دیتابیس واقعی نشان دهید؛ constraint به‌تنهایی تجربه مناسب تعارض را فراهم نمی‌کند. concurrency token یا سطح isolation مناسب را به پاسخ 409 قابل پیش‌بینی تبدیل کنید. retry باید محدود باشد و نباید عملیات را دو بار ثبت کند.

## معماری متناسب با زمان

یک معماری لایه‌ای ساده با Controllerهای کوچک و سرویس قابل تست برای تکمیل MVP کافی است. در مسیر ویژه، Domain مستقل، Application شامل use case و interface، Infrastructure شامل EF و سرویس خارجی، API شامل endpointها باشد. نام پوشه‌ها معیار کافی نیست. CQRS جداسازی Command و Query است و الزام دیتابیس دوم یا MediatR ندارد.

## Seed قابل تکرار

Seed باید صریحاً برای Development فعال شود؛ روی دیتابیس موجود داده تکراری نسازد؛ چند Asset و snapshot قیمت و دو Workspace مستقل فراهم کند. رمز آزمایشی از تنظیمات محلی خوانده شود، در سورس و خروجی عمومی قرار نگیرد. حساب تازه فاقد تاریخچه است؛ نمونه تاریخی را فقط در Workspace آزمایشی بسازید.

## ملاحظات امنیتی اجرایی

Issuer و Audience و lifetime و امضای JWT بررسی شوند. secret با متغیر محیطی یا User Secrets تأمین شود. HTTPS، CORS محدود به مبدأ Frontend و log بدون token و password استفاده شود. عضویت فعال را در هر درخواست کنترل کنید تا غیرفعال‌سازی در طول عمر JWT هم مؤثر باشد. DTO خروجی از entity دیتابیس جدا باشد. نرخ ورود محدود و خطای ورود عمومی باشد.

## داده بازار اختیاری

MVP از دیتابیس Seed می‌خواند. اتصال خارجی ویژه با HttpClient، timeout، cancellation، retry محدود با رعایت Retry-After، ذخیره آخرین قیمت و زمان freshness پیاده شود. در قطعی، آخرین داده ذخیره‌شده همراه observedAt بازگردد؛ داده کهنه را زنده معرفی نکنید. Redis اختیاری است.

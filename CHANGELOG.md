# Changelog — AI Academy Frontend

Прогресс фронтенда (TanStack Start SPA, FSD). Идёт вертикальными срезами вместе
с бэком; общий roadmap — `ai-academy-backend/MIGRATION_PLAN.md`. Этот файл —
живой трекер: отмечаем по мере готовности.

**Легенда:** ✅ готово · 🧪 покрыто тестами · 🟡 частично · ⬜ todo
Тесты: `vitest` — `bun run test`. CI: GitHub Actions `on: push`
(`typecheck` + `eslint` + `steiger` + `vitest` + `build`).

---

## Phase 0 — Фундамент

- ✅ TanStack Start SPA + Router (file-based) + TanStack Query + Zustand + typed `openapi-fetch`
- ✅ **FSD**-архитектура (app/pages/widgets/features/entities/shared) + `steiger` (линт границ слоёв)
- ✅ Брендинг (токены, шрифты, `widgets/header`), базовые `pages/login`, `pages/courses`
- ✅ Честные типы из OpenAPI (`bun run gen:api`)
- ✅ 🧪 Тесты (vitest: store/guards/схемы) + CI

## Phase 1 — Auth & профиль

- ✅ 🧪 **1.0** Сессия под паритетный `UserRead` (`entities/session`, типы `role_name/status/verified/...`)
- ✅ 🧪 **1.1** Регистрация: `features/auth/register` (3-шаговая форма + код) → `pages/register` + route
- ✅ 🧪 **1.2** Login через `username`; `features/auth/logout` (server logout + очистка сессии), кнопка в Header
- ✅ **1.3** Reset password: `features/auth/reset-password` (forgot+reset формы) → `pages/forgot-password`, `pages/reset-password` + routes
- ✅ 🧪 **1.4** `features/profile` (ProfileForm/PasswordForm/AvatarForm) → `pages/profile` (guarded) — _store-синк под тестом_
- ✅ 🧪 **1.5** Гварды `entities/session` (`requireAuth`/`requireRole`) на роутах
- ✅ **1.6** OAuth: `features/auth/oauth` (`OAuthButtons`, env-gated) на login/register

> 🧪-покрытие сейчас: session store, route guards, zod-схемы (login/register).
> Формы/страницы целиком пока не под компонентными тестами — добавим по мере роста.

## Phase 2 — Каталог (public)

- ✅ 🧪 **2.1** `entities/category` (query-опции + типы) + `CategoryNav` на странице курсов _(схемы/типы зелёные; query под smoke бэка)_
- ✅ **2.2** Course detail: `entities/course` (типы `CourseRead`/`CourseDetail`/`CourseTeacher`, `courseQueryOptions(slug)`, `CourseCard`→ссылка) + `pages/course` + публичный роут `/course/$slug`. tsc/lint/steiger/vitest/build зелёные
- ✅ **2.3** Filters: `widgets/course-filters` (категория/тип/сортировка/бесплатные) на странице курсов; `coursesQueryOptions(filters)`; tsc/lint/steiger/vitest/build зелёные
- ✅ **2.4** Featured: `featuredCoursesQueryOptions` + блок «Рекомендуемые» на странице курсов
- ✅ **2.5** Instructors: `entities/instructor` (instructors/profile queries, `InstructorCard`), `pages/instructors` (/instructors) + `pages/user` (/users/$userId), nav в Header
- ✅ **2.6** Reviews & comments: рейтинг + секции «Отзывы» и «Комментарии» (с ответами) на странице курса; ссылка на профиль инструктора

## Phase 3 — Обучение

- ✅ **3.1** Enrollment: `features/course-enroll` (free-enroll) + состояния на детали курса (Записаться/Вы записаны/Войдите); access-флаги из API
- ✅ **3.2** `pages/learn` (/learn/$slug): главы + items (file/text/session) с 🔒 для закрытых; `courseContentQueryOptions`; «Перейти к обучению» на детали курса
- ✅ **3.3** `features/lesson-progress` (`useToggleLearning` → инвалидирует `course-content`); чекбоксы «пройдено» на доступных items в `pages/learn`
- ✅ 🧪 **3.4** `entities/quiz` (queryOptions/типы) + `features/take-quiz` (`QuizRunner`: старт→ответы→грейдинг→результат, гейт попыток) + `pages/quiz` + route `/quiz/$quizId`; список тестов в `pages/learn` _(unit: answer_sheet + gate-messages)_
- ✅ 🧪 **3.5** `entities/assignment` (queryOptions/типы) + `features/submit-assignment` (multipart `SubmitAssignmentForm` + `useSubmitMessage`) + `pages/assignment` (определение + тред «моя работа») + route `/assignment/$assignmentId`; список заданий в `pages/learn` _(unit: submit gate-messages)_
- ✅ **3.6** Сертификаты: `entities/certificate` + `features/download-certificate` (auth'd blob → открытие PDF) + `pages/certificates` (мои достижения) + публичная `pages/certificate-validation`; routes `/certificates` (guarded) + `/certificate-validation`; ссылка в Header
- ✅ **3.7** Заметки: `entities/note` + `features/personal-note` (`NotePanel`: раскрывашка с textarea, save/delete, вложение) на доступных items в `pages/learn`; `noteQueryOptions` (404→null)
- ✅ **3.8** Noticeboards: `entities/noticeboard` (`courseNoticeboardsQueryOptions`) + секция объявлений (цветной left-accent по color, автор) в `pages/learn`
- ✅ **3.9** Форумы (Q&A): `entities/forum` (threads+answers queries) + `features/course-forum` (NewThreadForm, ThreadCard с ответами/pin/resolve по `can`-флагам) + `pages/course-forum` (/course-forum/$courseId); ссылка «Форум курса» в `pages/learn`

## Phase 4 — Коммерция

- ✅ **4.1** Cart: `entities/cart` (`cartQueryOptions`) + `features/cart` (`AddToCartButton`, add/remove хуки) + `pages/cart` (/cart, список+итоги, удаление); кнопка «В корзину» на детали курса + ссылка «Корзина» в Header
- ✅ **4.2** Купоны: `features/cart` `CouponForm` (`useValidateCoupon`, reason→текст) + строка скидки и пересчёт итогов в `pages/cart`
- ✅ **4.3** Checkout: `entities/order` + `features/checkout` (`CheckoutButton` → создаёт заказ из корзины с купоном) + `pages/orders` (/orders, статусы/итоги); кнопка «Оформить заказ» в корзине + ссылка «Заказы» в Header
- ✅ **4.4** Оплата: `entities/payment` (channels) + `features/pay-order` (PayButton: request→redirect) + `pages/payment-callback` (/payment/callback — verify→результат); «Оплатить» на pending-заказах
- ✅ **4.4.1** Драйверы шлюзов (UI): `PayButton` — выбор шлюза (лого/название из `image`, default→`supported`-драйвер) когда каналов >1; типы регенерированы (`credential_items`/`image`/`supported`)
- ✅ **4.5** Доступ после оплаты: `myCoursesQueryOptions` + `pages/my-courses` (/my-courses, грид `CourseCard`) + ссылка в Header + переход из payment-callback; инвалидация после оплаты
- ✅ **4.5.1** Sale accounting (UI): `entities/sale` (`sellerSalesQueryOptions`) + `pages/instructor-sales` (/instructor/sales — доход + таблица продаж, гейт `requireRole('teacher','organization')`) + ссылка «Продажи» на `pages/instructor`
- ✅ **4.6** История покупок: `purchasesQueryOptions` + `pages/purchases` (/purchases, список оплаченных курсов) + ссылка с «Мои заказы»

## Сквозные (foundation)

- ✅ **F.6** i18n/валюта UI: `entities/preference` (persist-стор locale/currency) + middleware openapi-fetch (шлёт `locale`/`currency`) + `features/app-settings` (переключатели языка EN/RU/TJ и валюты из `/currencies`) в Header; смена инвалидирует query-кэш

## Phase 5 — Вовлечение

- ✅ **5.1** Избранное: `entities/favorite` + `features/favorite-toggle` (FavoriteButton ♥ на детали курса, `useIsFavorite`/`useToggleFavorite`) + `pages/favorites` (/favorites, грид) + ссылка в Header
- ✅ **5.2** Подписки: `features/follow-user` (FollowButton + счётчик подписчиков) на публичном профиле `pages/user`; состояние из `is_following`/`followers_count`
- ✅ **5.3** Уведомления: `entities/notification` (`notificationsQueryOptions`) + `features/notifications` (`NotificationBell`: дропдаун с unread-бейджем + mark-seen в Header) + `pages/notifications` (/notifications, фильтры все/непрочитанные/прочитанные, кнопка «Прочитано»)
- ✅ **5.4** Поддержка: `entities/support` (index/detail/departments queries) + `features/support` (`CreateTicketForm`, `TicketThread` с ответом/закрытием, multipart-вложения) + `pages/support` (/support — секции «мои по курсам»/«по моим курсам»/«платформа», новое обращение) + `pages/support-ticket` (/support/$supportId — тред переписки) + ссылка в Header
- ✅ **5.5** Блог: `entities/blog` (list/detail/categories queries) + `features/blog-comment` (`BlogCommentForm`) + `pages/blog` (/blog — грид + фильтр по категориям) + `pages/blog-post` (/blog/$blogId — статья + комментарии с ответами) + публичная ссылка «Блог» в Header
- ✅ 🧪 **5.6** Newsletter: `features/newsletter-subscribe` (`NewsletterForm` + `useSubscribeNewsletter`, 422→«уже подписан») в новом `widgets/footer` (смонтирован в `__root`) _(unit: subscribe gate-messages)_
- ✅ 🧪 **5.7** Rewards/баллы: `entities/reward` (overview + reward-courses queries) + `features/redeem-points` (`useRedeemCourse`/`useExchangePoints`, маппинг gate-кодов) + `pages/rewards` (/rewards: баланс/история/курсы за баллы; 404-гейт → «недоступно») + ссылка «Баллы» в Header _(unit: redeem gate-messages)_

## Phase 6 — Инструктор

- ✅ 🧪 **6.1** Course CRUD: `features/manage-course` (`CourseForm` + `useCreateCourse`/`useUpdateCourse`/`useDeleteCourse`, classes/edit queries) + `pages/instructor` (список «Мои курсы» + create/edit/delete) + routes `/instructor`, `/instructor/course/new`, `/instructor/course/$courseId/edit` (guarded) + ссылка «Преподавание» в Header _(unit: manage gate-messages)_
- ✅ **6.2** Quizzes CRUD: `features/manage-quiz` (`QuizForm` + `useCreateQuiz`/`useUpdateQuiz`/`useDeleteQuiz`, results-dashboard query) + `pages/instructor-quizzes` (/instructor/quizzes — список тестов с inline create/edit/delete + сводка результатов студентов) + ссылка «Тесты» на `pages/instructor`
- ✅ **6.3** Assignment grading: `features/grade-assignment` (dashboard/submissions queries + `SubmissionThread` с inline-оценкой) + `pages/instructor-assignments` (/instructor/assignments — счётчики + раскрывающиеся задания с тредами работ и выставлением балла) + ссылка «Задания» на `pages/instructor`
- ✅ **6.4** Instructor comments: `features/class-comments` (`classCommentsQueryOptions` + `CommentReply` inline-форма) + `pages/instructor-comments` (/instructor/comments — комментарии к курсам деревом + ответы) + ссылка «Комментарии» на `pages/instructor`
- ✅ **6.5** Bundles: `features/manage-bundle` (`bundlesQueryOptions` + `useDeleteBundle`) + `pages/instructor-bundles` (/instructor/bundles — список наборов + счётчики + удаление) + ссылка «Наборы» на `pages/instructor`
- ✅ **6.6** Store/products: `entities/product` (list/detail/categories queries) + `pages/store` (/store — каталог + фильтр по категориям) + `pages/product` (/store/$productId) + ссылка «Магазин» в footer
- ✅ **6.6.1** Product purchase: `features/buy-product` (`usePayProduct`, POST `/products/{id}/pay`) + кнопка «Купить за {price}» на `pages/product` → переход в `/orders`
- ✅ **6.7** Statistics: `courseStatisticsQueryOptions` (в `features/manage-course`) + `pages/instructor-statistics` (/instructor/course/$courseId/statistics — сетка агрегатов) + ссылка «Статистика» на каждом курсе в `pages/instructor`

## Phase 7 — Live & advanced

- ✅ **7.1** Консультации: `entities/meeting` (config/instructor/index queries) + `features/manage-meeting` (`MeetingConfigForm`: цена/слоты + finish) + `features/reserve-meeting` (`ReserveMeetingPanel` на публичном профиле) + `pages/instructor-meetings` (/instructor/meetings — настройки + заявки) + `pages/my-meetings` (/meetings — мои записи) + ссылки «Консультации»/«Встречи»
- ✅ 🧪 **7.2** Subscriptions: `entities/subscription` (list+active query) + `features/subscribe` (`useActivatePlan`/`useApplySubscription` + `SubscribeApplyButton`, маппинг gate-кодов) + `pages/subscriptions` (/subscriptions — планы + активация + статус) + кнопка «Открыть по подписке» на платном subscribable-курсе + ссылка «Подписки» в footer _(unit: subscribe gate-messages)_
- ✅ 🧪 **7.3** Bundle purchase: `entities/bundle` (list/detail queries) + `features/buy-bundle` (`useBuyFreeBundle`/`useBuyBundleWithPoints`, маппинг gate-кодов) + `pages/bundles` (/bundles — грид) + `pages/bundle` (/bundles/$bundleId — курсы + покупка free/баллы) + ссылка «Наборы» в footer _(unit: buy gate-messages)_
- ✅ **7.3.1** Paid bundle: `usePayBundle` (POST `/bundles/{id}/pay` → pending-заказ) + кнопка «Купить за {price}» на платном наборе в `pages/bundle` → переход в `/orders` для оплаты существующим `PayButton`
- ✅ 🧪 **registration-packages**: `entities/registration-package` + `features/activate-package` (`useActivatePackage`, маппинг gate-кодов) + `pages/registration-packages` (/instructor/packages — пакеты по роли, активный пакет, активация free) + ссылка «Пакеты» на `pages/instructor` _(unit: activate gate-messages)_
- ✅ **7.2.1** Paid subscription: `usePayPlan` (POST `/subscribe/{id}/pay`) + кнопка «Купить за {price}» на платном плане в `pages/subscriptions` → переход в `/orders`
- ✅ **7.1.1** Paid meeting: `usePayReservation` (POST `/meetings/reserve/{id}/pay`) + кнопка «Оплатить {amount}» на pending-броне в `pages/my-meetings` → переход в `/orders`

## Admin

- ✅ **A.1** Payment channels: `features/manage-payment-channels` (`adminChannelsQueryOptions` + `ChannelEditor`: креды по `credential_items`, валюты, test-mode toggle, статус; `CreateChannelForm`) + `pages/admin-payments` (/admin/payment-channels — список + редактирование + добавление, гейт `requireRole('admin')`) + ссылка «Админ» в Header (только для admin)
- ✅ **A.2** Course moderation: `features/moderate-courses` (`adminCoursesQueryOptions` + approve/reject/unpublish хуки) + `pages/admin-courses` (/admin/courses — список со статус-бейджами + действия, гейт `requireRole('admin')`) + кросс-ссылки между admin-страницами; «Админ» в Header → /admin/courses
- ✅ **A.3** User management: `features/manage-users` (`adminUsersQueryOptions` + ban/unban/set-role хуки) + `pages/admin-users` (/admin/users — фильтр по роли, селект роли, бан/разбан, гейт `requireRole('admin')`) + кросс-ссылка
- ✅ **R.1** Course reviews: `features/write-review` (`ReviewForm` — звёздные оценки по 4 измерениям + текст) на странице курса для купивших + `features/moderate-reviews` + `pages/admin-reviews` (/admin/reviews — очередь pending + одобрить/отклонить, гейт `requireRole('admin')`) + кросс-ссылка «Отзывы»

## Дизайн-система / Кабинет (переход на легаси-вид)

> Начат перевод визуала на клон легаси-темы `design_1`: вместо навбара — **сайдбар-кабинет**, переиспользуемые компоненты в `shared/ui`.

- ✅ 🧪 **P.1** `shared/ui`-кит (Tailwind, брендбук-токены): `Button` (variants/sizes), `Card`, `Badge`, `Avatar`, `Spinner`, `EmptyState`, `PageHeader`, `StatCard` _(unit: Button/StatCard)_
- ✅ 🧪 **P.1** `widgets/panel-layout` (`PanelLayout` + сайдбар): role-aware секции (Обучение/Преподавание[teacher+]/Администрирование[admin]/Аккаунт) клонированы из легаси `SidebarItems`, active-подсветка по пути, мобильный drawer; links → существующие cabinet-роуты _(unit: menu role-filtering)_
- ✅ **P.1** `entities/dashboard` (`dashboardQueryOptions`) + `pages/dashboard` (/panel — приветствие + StatCard'ы по `/panel/dashboard`, быстрые переходы; гейт `requireAuth`) + ссылка «Кабинет» в Header
- ✅ **P.2** Сквозной сайдбар: `withPanel()` HOC оборачивает **все авторизованные роуты** в `PanelLayout` — кабинет (my-courses/purchases/favorites/orders/certificates/notifications/meetings/rewards/profile/support) + инструктор (`/instructor/*`) + админ (`/admin/*`). Навбар → сайдбар по всему авторизованному разделу
- ⬜ далее: чистка дублирующих cross-link'ов на instructor/admin-страницах (теперь в сайдбаре); публичная оболочка (хедер/футер) и landing — отдельно (легаси-главная — CMS landing-builder)

- ✅ **P.4** Гостевая главная (`/`): guard больше НЕ редиректит гостя на /login — гость видит лендинг (авторизованный → /panel). `pages/landing` переписан 1:1 под дизайн: Hero (бейдж + заголовок + 2 CTA + декоративные арки-плейсхолдеры), Features (чеклист + 4 карточки), Partners (лого-сетка 3×4), FAQ (аккордеон), Forums (синяя полоса + белая карточка + аватары), Testimonials (отзывы со звёздами), CTA. Навбар (`GuestHeader`) теперь `sticky top-0` — остаётся сверху при скролле. NOTE: изображения (фото студентов, лого партнёров, аватары) — плейсхолдеры до загрузки реальных ассетов

- ✅ **P.5** Навбар (гость): «Categories» — настоящий дропдаун (живые категории → каталог); ссылки Home→`/`, Courses→`/courses`, News→`/blog`; навбар `sticky`. ⬜ **Forums (глобальный)** — отложено (нужна подсистема топиков/постов; временно → каталог)
- ✅ **P.6** Contact (`/contact`, публичная): `features/contact` (`useSubmitContact` → `POST /contact`) + `pages/contact` 1:1 по дизайну — синяя инфо-карточка (телефон/почта/адрес), форма (имя/почта/телефон/тема/сообщение/captcha клиентская), карта OpenStreetMap с маркером по координатам офиса; навбар Contact→`/contact`
- ✅ **P.11** Выбор роли при регистрации (паритет легаси `account_type`): на шаге 1 формы — переключатель **Студент / Инструктор** (учиться / продавать курсы) → `account_type` уходит в `/auth/register/step/1` (teacher → роль инструктора, иначе студент). Дашборд/сайдбар уже адаптируются по `role_name`. NOTE: полный flow «Стать инструктором» (заявка существующего студента + аппрув админа, как `BecomeInstructor` в легаси) — отдельная бо́льшая подсистема, отложена
- ✅ 🧪 **P.10** Финансы студента 1:1 по легаси: **Финансовый отчёт** (`/finance` → `/panel/financial/accounting`) — таблица «Финансовые документы» (описание/сумма ±/дата) + фильтры (поиск/тип); **Пополнение счёта** (`/charge-account`) — карточка баланса (`/panel/financial/account`), форма офлайн-пополнения (`features/charge-account` → `POST /panel/financial/offline-payments`), «История офлайн-транзакций» (банк/реф.код/сумма/статус Одобрено·В ожидании·Отклонено). `entities/financial` (balance/accounting/offline). Группа сайдбара **Финансы** → Финансовый отчёт / Пополнить счёт / Подписки. Карточка кошелька на дашборде теперь показывает реальный баланс. Тест: `FinancialReportPage`
- ✅ 🧪 **P.9** Сайдбар → вложенный аккордеон 1:1 по легаси `SidebarItems`: секции **Главное меню / Образование / Оценка / Финансы и маркетинг / Преподавание / Администрирование / Коммуникации / Аккаунт**; группы с подпунктами раскрываются (активная группа авто-раскрыта). Новые страницы студента (гейт `requireAuth`): **Мои задания** (`/assignments` → `/panel/my_assignments`), **Мои результаты** (`/quiz-results`), **Не участвовал** (`/quiz-opens`), **Мои комментарии** (`/my-comments`) — каждая с легаси пустым состоянием. Расширены `entities/quiz` (my-results/opens) и `entities/assignment` (my); новый `entities/comment`. Тесты: меню (структура + саблинки Курсов) и `MyAssignmentsPage`
- ✅ 🧪 **P.8** Сайдбар кабинета: блок аватара 1:1 по легаси — крупный аватар + имя + счётчики **Курсы / Подписки** (`enrolled_count` / `following_count` из `/panel/dashboard`); добавлен пункт меню **Календарь событий**. Новая страница `pages/events-calendar` (`/calendar`, гейт `requireAuth`) 1:1 по легаси `EventsCalendarController`: 3 колонки — выбор даты (свой месячный календарь с точками-маркерами дней с событиями), «События за {дата}» (+ пустое «События не найдены!»), «Предстоящие события» (клик → переход к дате). `entities/events-calendar` (`eventsCalendarQueryOptions` → `GET /panel/events-calendar`). Метки типов событий + ссылка «добавить в Google Calendar». NOTE: типы событий из неперенесённых подсистем (тесты/дедлайны заданий/подписки/мероприятия) — пустые, наполнятся по мере переноса (см. backend P.8)
- ✅ 🧪 **P.7** Панель студента (`/panel`) 1:1 по легаси `Panel\DashboardController` (student): `pages/dashboard` переписан в 3-колоночный лейаут — hello-box (градиент + приветствие + 4 счётчика Курсы/Встречи/Сертификаты/Сданные тесты по `/panel/dashboard`), карточка кошелька («Текущий баланс»/«Нет баланса»), Обзор курсов, Мои задания, Активность в обучении, Доска объявлений, CTA «Нужна помощь по курсу?», Мои тесты, Календарь событий, Предстоящие онлайн-сессии — с легаси пустыми состояниями. Бэк расширен счётчиками (см. backend P.7). NOTE: подсистемы (assignments-on-dashboard, learning-activity-chart, события, live-сессии, accounting/баланс) — пустые состояния до их переноса

## Backlog (после MVP)

- ⬜ **Phase 5** (далее) newsletter, rewards
- ⬜ **Phase 6** инструктор-кабинет (создание курсов/квизов, грейдинг, store)
- ⬜ **Phase 7** live/meetings, subscriptions
- ⬜ i18n UI (если нужен мультиязычный переключатель)

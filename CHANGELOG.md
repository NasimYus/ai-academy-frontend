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
- ✅ **4.5** Доступ после оплаты: `myCoursesQueryOptions` + `pages/my-courses` (/my-courses, грид `CourseCard`) + ссылка в Header + переход из payment-callback; инвалидация после оплаты
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

## Backlog (после MVP)

- ⬜ **Phase 5** (далее) newsletter, rewards
- ⬜ **Phase 6** инструктор-кабинет (создание курсов/квизов, грейдинг, store)
- ⬜ **Phase 7** live/meetings, subscriptions
- ⬜ i18n UI (если нужен мультиязычный переключатель)

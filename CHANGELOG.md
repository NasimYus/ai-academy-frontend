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
- ⬜ **3.5** `features/submit-assignment`
- ⬜ **3.6** Сертификаты · **3.7** Заметки · **3.8** Noticeboards · **3.9** Форумы

## Phase 4 — Коммерция

- ⬜ **4.1** `entities/cart` + `pages/cart` · **4.2** Купоны · **4.3** `features/checkout`
- ⬜ **4.4** Оплата (redirect/return) · **4.5** Доступ после оплаты · **4.6** `pages/my-courses`

## Backlog (после MVP)

- ⬜ **Phase 5** favorites, follow, notifications, support, blog, rewards
- ⬜ **Phase 6** инструктор-кабинет (создание курсов/квизов, грейдинг, store)
- ⬜ **Phase 7** live/meetings, subscriptions
- ⬜ i18n UI (если нужен мультиязычный переключатель)

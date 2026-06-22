# HANDOFF — AI Academy Frontend (FSD migration)

> Документ для передачи контекста в новое окно/сессию. Описывает текущее
> состояние фронтенда после перевода на **Feature-Sliced Design (FSD)**,
> правила, по которым он теперь устроен, как проверять, и что осталось
> сделать (в т.ч. backend greenlet-фикс, который в этой сессии **не**
> трогался).

Дата: 2026-06-22 · Ветка: `claude/great-knuth-soopsd` (во всех трёх репозиториях).

---

## 1. Что сделано в этой сессии

Переведён `ai-academy-frontend` со «плоской» структуры (`components/`,
`stores/`, `lib/`, `integrations/`, `api/`) на каноническую **FSD**-структуру.
Логика приложения **не менялась** — это чисто архитектурный рефактор
(перемещение + переименование + тонкие фасады). Поведение идентично исходному.

Проверено локально:
- `npx tsc --noEmit` → **0 ошибок**
- `bun --bun run build` (Vite + Nitro + prerender) → **успешно**
- `bun --bun run lint` → 6 ошибок, **унаследованных 1:1 с `main`** (см. §5)

---

## 2. Новая структура (FSD)

Слои сверху вниз: `app → pages → widgets → features → entities → shared`.
Импорт разрешён только «вниз» по слоям. Кросс-импорт через публичный API
слайса (`index.ts`), а не вглубь.

```
src/
  app/                         # композиция приложения
    providers/
      query.tsx                # getContext() — QueryClient для роутера/SSR
      query-devtools.tsx       # плагин панели React Query Devtools
    styles.css                 # глобальные стили (Tailwind + токены брендбука)
  pages/                       # страницы = композиция features/entities
    login/    ui/LoginPage.tsx       (+ index.ts)
    courses/  ui/CoursesPage.tsx     (+ index.ts)
  widgets/                     # самостоятельные блоки UI
    header/   ui/Header.tsx          (+ index.ts)
  features/                    # пользовательские сценарии
    auth/login/
      ui/LoginForm.tsx         # форма + useMutation(login)
      model/schema.ts          # zod loginSchema + LoginInput
      api/login.ts             # login(): POST /auth/login → GET /auth/me
      index.ts
  entities/                    # бизнес-сущности
    session/
      model/store.ts           # zustand-стор (token+user), persist 'ai-academy-auth'
      index.ts                 # экспорт useSessionStore, тип User
    course/
      ui/CourseCard.tsx
      model/types.ts           # type Course = components['schemas']['CourseRead']
      api/courses.ts           # coursesQueryOptions (TanStack Query)
      index.ts
  shared/                      # переиспользуемое, не знает о домене
    api/
      client.ts                # openapi-fetch клиент + setAuthTokenGetter()
      schema.d.ts              # СГЕНЕРИРОВАННЫЙ контракт (openapi-typescript)
      index.ts                 # экспорт api, setAuthTokenGetter, типы paths/components

  # framework-pinned — НЕ перемещать (TanStack Start/Router их находит по пути):
  router.tsx                   # getRouter(); routeTree.gen.ts ссылается на './router.tsx'
  routeTree.gen.ts             # генерируется `tsr generate` — не редактировать руками
  routes/                      # файловый роутинг; теперь это тонкие обёртки
    __root.tsx                 # шелл документа + <Header/> + devtools
    index.tsx                  # redirect '/' → '/courses' | '/login'
    login.tsx                  # component: LoginPage
    courses.tsx                # beforeLoad guard + component: CoursesPage
```

### Алиасы путей
В `tsconfig.json` и `package.json#imports` определены `#/*` и `@/*` → `./src/*`.
Везде используется `#/...` (например, `#/entities/session`, `#/shared/api`).

---

## 3. Важное архитектурное решение: auth-токен без нарушения слоёв

Проблема: исходный `lib/api.ts` импортировал `stores/auth` — это `shared → entity`,
что в FSD запрещено (нижний слой не может зависеть от верхнего).

Решение — инверсия зависимости:
- `shared/api/client.ts` экспортирует `setAuthTokenGetter(getter)` и держит
  локальный `getAuthToken`, который дёргается в `onRequest` интерсепторе.
- `entities/session/model/store.ts` при загрузке модуля вызывает
  `setAuthTokenGetter(() => useSessionStore.getState().token)`.

Так `shared` остаётся независимым, а связывание происходит на уровне entity.
Регистрация — сайд-эффект при импорте `entities/session`, который и так
подтягивается роутами (`beforeLoad`/Header/LoginForm) до первого запроса.

---

## 4. Переименования (для grep'а истории)

| Было                              | Стало                                   |
|-----------------------------------|-----------------------------------------|
| `useAuthStore` (`stores/auth.ts`) | `useSessionStore` (`entities/session`)  |
| `lib/api.ts`                      | `shared/api/client.ts`                  |
| `lib/schemas.ts` (`loginSchema`)  | `features/auth/login/model/schema.ts`   |
| `components/Header.tsx`           | `widgets/header/ui/Header.tsx`          |
| `integrations/tanstack-query/*`   | `app/providers/query*.tsx`              |
| `api/schema.d.ts`                 | `shared/api/schema.d.ts`                |

`package.json` → скрипт `gen:api` обновлён на новый путь схемы
(`-o src/shared/api/schema.d.ts`). Persist-ключ стора оставлен прежним
(`ai-academy-auth`), чтобы не разлогинивать существующих пользователей.

---

## 5. Известные предупреждения (НЕ регресс)

`bun run lint` выдаёт 6 ошибок `@typescript-eslint/no-unnecessary-condition` /
`no-unnecessary-type-assertion` в `entities/course/api/courses.ts`,
`features/auth/login/api/login.ts`, `LoginForm.tsx`, `CoursesPage.tsx`.

Это **унаследовано дословно** из исходного кода (проверено: на `main` тот же
набор из 6 ошибок в `routes/courses.tsx` и `routes/login.tsx`). Причина:
OpenAPI-контракт не описывает error-ответы, поэтому type-aware ESLint считает
`error`/`!data` «всегда ложными». Гварды (`if (error || !data)`) оставлены
намеренно — openapi-fetch **реально** заполняет `error` на не-2xx в рантайме,
и их удаление было бы регрессом обработки ошибок под видом рефактора.

Если нужно убрать из линта — варианты: добавить error-схемы в OpenAPI на
бэкенде (тогда типы станут честными), либо точечно `// eslint-disable-next-line`,
либо отключить правило для `**/api/*.ts`. Решать отдельно, вне FSD-задачи.

---

## 6. Как запускать / проверять

```bash
cd ai-academy-frontend
bun install
bun --bun run dev          # http://localhost:3000 (ждёт API на :8000)
bun --bun run generate-routes   # пересобрать routeTree.gen.ts
npx tsc --noEmit           # типы
bun --bun run build        # прод-сборка (Vite + Nitro)
bun --bun run lint         # см. §5
bun --bun run gen:api      # регенерация схемы (нужен запущенный backend :8000)
```

Стек: TanStack Start (SPA-режим) + Router (file-based) + React 19 + TanStack
Query + Zustand + Zod + Tailwind v4 + openapi-fetch. Менеджер пакетов — **bun**.

---

## 7. Что осталось / вне этой сессии

### 7.1 Backend greenlet-фикс — НЕ сделан (нет контекста)
Из исходного запроса фигурировал «greenlet-фикс» для бэкенда, но конкретной
ошибки/репро из «другого чата» в этой сессии не было, поэтому фикс **не
вносился** (чтобы не выдумывать). Контекст для будущей сессии:

- `ai-academy-backend` — FastAPI + async SQLAlchemy.
- `app/core/database.py`: `async_sessionmaker(..., expire_on_commit=False)`,
  `get_db()` отдаёт `AsyncSession` через `async with`.
- Репозитории (`app/repositories/{users,courses}.py`) возвращают ORM-объекты.
- Типичная причина `greenlet_spawn has not been called` — ленивая подгрузка
  relationship'ов вне активной async-сессии (например, при сериализации в
  Pydantic-схему уже после закрытия сессии) или обращение к не загруженному
  атрибуту. Лечится `selectinload`/`joinedload` в запросе или загрузкой нужных
  полей до выхода из контекста сессии.
- Точные модели смотреть в `app/models/{user,course}.py`, схемы — `app/schemas/`.

Прежде чем чинить — получить реальный стектрейс/эндпоинт, на котором падает.

### 7.2 Про «бандлы для локального наката»
В этом окружении работа ведётся напрямую через git (ветка
`claude/great-knuth-soopsd`), а не через патч-бандлы. Чтобы забрать изменения
локально: `git fetch origin claude/great-knuth-soopsd && git checkout claude/great-knuth-soopsd`.
Если всё же нужен патч-файл — его можно сгенерить из коммита FSD:
`git format-patch main..claude/great-knuth-soopsd -- ai-academy-frontend` (или
`git diff main..claude/great-knuth-soopsd`).

---

## 8. Автопроверка FSD-границ (steiger) — подключено

Подключён официальный FSD-линтер **steiger** (`steiger@^0.5`,
`@feature-sliced/steiger-plugin@^0.6`).

- Конфиг: `steiger.config.js` (ESM). Базируется на `fsd.configs.recommended`.
- Запуск: `bun --bun run lint:fsd` (скрипт = `steiger ./src`). Сейчас — `√ No problems found!`.
- `ignores`: `routeTree.gen.ts`, `router.tsx`, `routes/**` — framework-pinned,
  не следуют слайс-конвенциям FSD.
- Отключено единственное правило `fsd/insignificant-slice` (advisory-эвристика
  «слайс используется ≤1 раза → слей»). Для молодого/малого кода она шумит и
  наказывает заранее заведённую структуру; к тому же реальный потребитель
  слоёв — `routes/**` — исключён, поэтому ссылки оттуда не считаются. Все
  значимые правила (границы слоёв, public API, кросс-импорты) оставлены
  включёнными — они и есть настоящие guardrail'ы.

> При желании можно дополнительно навесить `eslint-plugin-boundaries`, но это
> дублирует steiger и требует ручного описания слоёв — пока избыточно.

## 9. Дальнейшие шаги по FSD (рекомендации)

- Новый функционал раскладывать так: данные/типы сущности → `entities/*`,
  пользовательский сценарий → `features/*`, сборка экрана → `pages/*`,
  переиспользуемый чистый код → `shared/*`. Кросс-импорт — только через
  `index.ts` слайса.
- При росте `shared` завести сегменты `shared/ui`, `shared/lib`, `shared/config`.

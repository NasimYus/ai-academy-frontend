# CLAUDE.md — AI Academy Frontend

TanStack Start SPA для LMS, построенная по **Feature-Sliced Design (FSD)**.
Растёт вертикальными срезами вместе с бэком (`../ai-academy-backend`), который
переписывает легаси Laravel (`../ai-academy`) с принципом 1:1 паритета логики.

## Стек
TanStack Start + Router (file-based) + Query · React 19 · Zustand (сессия) ·
Zod · Tailwind v4 · **openapi-fetch** (типизированный клиент) · **bun** ·
vitest · eslint · **steiger** (FSD-линт).

## Команды
```bash
bun install
bun run dev            # дев-сервер :3000 (ждёт API на :8000)
bun run gen:api        # регенерация типов из OpenAPI (нужен запущенный backend)
bun run generate-routes# пересборка routeTree.gen.ts
bun run typecheck      # tsc --noEmit
bun run lint           # eslint
bun run lint:fsd       # steiger (границы слоёв)
bun run test           # vitest
bun run build          # vite build (Nitro)
bun run format         # prettier + eslint --fix
```

## FSD — структура и правила
Слои сверху вниз: **app → pages → widgets → features → entities → shared**.
Импорт только «вниз»; кросс-импорт — через публичный API слайса (`index.ts`),
не вглубь. Алиас путей: `#/...` → `src/...`.

```
src/
  app/        providers (QueryClient, devtools), styles.css
  pages/      экраны = композиция features/entities (login, register, courses, profile, …)
  widgets/    самостоятельные блоки (header)
  features/   сценарии (auth/login, auth/register, auth/logout, auth/reset-password, auth/oauth, profile)
  entities/   бизнес-сущности (session — auth+guards, course, category)
  shared/     api (openapi-fetch client + сгенерированная schema.d.ts), переиспользуемое
  # framework-pinned — НЕ перемещать (их находит TanStack):
  routes/, router.tsx, routeTree.gen.ts (генерируется)
```
`steiger.config.js`: `routes/**`/`router.tsx`/`routeTree.gen.ts` в ignore;
правило `fsd/insignificant-slice` выключено. После добавления слайса `lint:fsd`
должен оставаться зелёным.

## Конвенции
- **openapi-fetch паттерны** (важно для lint):
  - если у эндпоинта объявлены error-ответы → `if (error) throw ...; return data` (data сузится).
  - если error-ответов нет → `const { data } = await api.GET(...); return data?.x ?? default` (без `if(error)`).
  - ошибки TanStack Query типизированы как `Error` — без `as Error`, используем `?.message`.
- **Сессия** — `entities/session`: `useSessionStore` (zustand persist `ai-academy-auth`), guards `requireAuth`/`requireRole` для `beforeLoad`.
- Защищённые роуты: `beforeLoad: () => requireAuth()`.
- Типы API НЕ редактируем руками — регенерируем (`gen:api`) после изменений бэка.
- `routeTree.gen.ts` коммитим; eslint игнорит `.output/`, `dist/`, конфиги.

## Тесты
- `vitest.config.ts`: jsdom, алиас `#/`, `zod` в inline-deps. Файлы `*.test.ts(x)` рядом с кодом.
- Сейчас покрыто: session store, route guards, zod-схемы (login/register).
- Покрытие отмечаем в `CHANGELOG.md` пометкой 🧪.

## Процесс и документы
- **Рабочий цикл**: бэк-модуль → этот фронт-модуль → тест → отметка → дальше.
- Прогресс: **`CHANGELOG.md`** (что готово / 🧪 покрыто / осталось) — обновлять каждый срез.
- Roadmap/принципы (общие): `../ai-academy-backend/MIGRATION_PLAN.md`. Контекст FSD-миграции: `HANDOFF.md`.
- Ветка разработки и пуш — `main`.
- CI: `.github/workflows/ci.yml` (typecheck + eslint + steiger + vitest + build) на каждый push.

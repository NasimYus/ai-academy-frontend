// Sidebar menu — cloned from legacy App\Mixins\Panel\SidebarItems, grouped by
// section, mapped to the SPA routes that already exist. `roles` gates a section.
export interface MenuItem {
  to: string
  label: string
  icon: string
}
export interface MenuSection {
  title: string
  roles?: string[] // visible only to these role_names; omit = everyone
  items: MenuItem[]
}

export const MENU: MenuSection[] = [
  {
    title: 'Обучение',
    items: [
      { to: '/panel', label: 'Дашборд', icon: '▦' },
      { to: '/my-courses', label: 'Мои курсы', icon: '🎓' },
      { to: '/purchases', label: 'Покупки', icon: '🧾' },
      { to: '/favorites', label: 'Избранное', icon: '♥' },
      { to: '/certificates', label: 'Сертификаты', icon: '🏅' },
      { to: '/meetings', label: 'Консультации', icon: '🗓' },
      { to: '/subscriptions', label: 'Подписки', icon: '∞' },
      { to: '/rewards', label: 'Баллы', icon: '★' },
    ],
  },
  {
    title: 'Преподавание',
    roles: ['teacher', 'organization', 'admin'],
    items: [
      { to: '/instructor', label: 'Мои курсы', icon: '📚' },
      { to: '/instructor/sales', label: 'Продажи', icon: '💰' },
      { to: '/instructor/bundles', label: 'Наборы', icon: '📦' },
      { to: '/instructor/packages', label: 'Пакеты', icon: '🎁' },
      { to: '/instructor/quizzes', label: 'Тесты', icon: '❓' },
      { to: '/instructor/assignments', label: 'Задания', icon: '📝' },
      { to: '/instructor/comments', label: 'Комментарии', icon: '💬' },
      { to: '/instructor/meetings', label: 'Настройка консультаций', icon: '⚙' },
    ],
  },
  {
    title: 'Администрирование',
    roles: ['admin'],
    items: [
      { to: '/admin/courses', label: 'Модерация курсов', icon: '✓' },
      { to: '/admin/users', label: 'Пользователи', icon: '👥' },
      { to: '/admin/reviews', label: 'Отзывы', icon: '⭐' },
      { to: '/admin/payment-channels', label: 'Платёжные шлюзы', icon: '💳' },
    ],
  },
  {
    title: 'Аккаунт',
    items: [
      { to: '/orders', label: 'Заказы', icon: '🛒' },
      { to: '/notifications', label: 'Уведомления', icon: '🔔' },
      { to: '/support', label: 'Поддержка', icon: '🆘' },
      { to: '/profile', label: 'Профиль', icon: '👤' },
    ],
  },
]

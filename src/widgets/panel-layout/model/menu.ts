import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Star,
  Store,
  User,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Sidebar — cloned from legacy App\Mixins\Panel\SidebarItems: sections →
// groups (icon + optional accordion of sub-links). A group with `items`
// expands; one with only `to` is a plain link. `roles` gates a whole section.
export interface MenuLink {
  to: string
  label: string
}
export interface MenuGroup {
  label: string
  icon: LucideIcon
  to?: string
  items?: MenuLink[]
}
export interface MenuSection {
  title: string
  roles?: string[] // visible only to these role_names; omit = everyone
  groups: MenuGroup[]
}

export const MENU: MenuSection[] = [
  {
    title: 'Главное меню',
    groups: [
      { label: 'Панель управления', icon: LayoutDashboard, to: '/panel' },
      { label: 'Календарь событий', icon: CalendarDays, to: '/calendar' },
    ],
  },
  {
    title: 'Образование',
    groups: [
      {
        label: 'Курсы',
        icon: GraduationCap,
        to: '/my-courses',
        items: [
          { to: '/purchases', label: 'Мои покупки' },
          { to: '/my-comments', label: 'Мои комментарии' },
          { to: '/favorites', label: 'Избранное' },
        ],
      },
      { label: 'Встречи', icon: Users, to: '/meetings' },
    ],
  },
  {
    title: 'Оценка',
    groups: [
      {
        label: 'Домашние задания',
        icon: ClipboardList,
        items: [{ to: '/assignments', label: 'Мои задания' }],
      },
      {
        label: 'Тесты',
        icon: ClipboardCheck,
        items: [
          { to: '/quiz-results', label: 'Мои результаты' },
          { to: '/quiz-opens', label: 'Не участвовал' },
        ],
      },
      {
        label: 'Сертификаты',
        icon: Award,
        items: [
          { to: '/certificates', label: 'Мои достижения' },
          { to: '/certificate-validation', label: 'Проверка сертификата' },
        ],
      },
    ],
  },
  {
    title: 'Финансы и маркетинг',
    groups: [
      { label: 'Магазин', icon: Store, to: '/store' },
      {
        label: 'Финансы',
        icon: Wallet,
        items: [
          { to: '/finance', label: 'Финансовый отчёт' },
          { to: '/charge-account', label: 'Пополнить счёт' },
          { to: '/subscriptions', label: 'Подписки' },
        ],
      },
      { label: 'Баллы', icon: Star, to: '/rewards' },
    ],
  },
  {
    title: 'Карьера',
    roles: ['user'],
    groups: [{ label: 'Стать инструктором', icon: GraduationCap, to: '/become-instructor' }],
  },
  {
    title: 'Преподавание',
    roles: ['teacher', 'organization', 'admin'],
    groups: [
      { label: 'Мои курсы', icon: BookOpen, to: '/instructor' },
      { label: 'Создать курс', icon: Plus, to: '/instructor/course/new' },
      { label: 'Продажи', icon: Wallet, to: '/instructor/sales' },
      { label: 'Наборы', icon: Package, to: '/instructor/bundles' },
      { label: 'Тесты', icon: ClipboardCheck, to: '/instructor/quizzes' },
      { label: 'Задания', icon: ClipboardList, to: '/instructor/assignments' },
      { label: 'Комментарии', icon: MessageSquare, to: '/instructor/comments' },
      { label: 'Настройка консультаций', icon: Settings, to: '/instructor/meetings' },
    ],
  },
  {
    title: 'Администрирование',
    roles: ['admin'],
    groups: [
      { label: 'Модерация курсов', icon: CheckCircle, to: '/admin/courses' },
      { label: 'Пользователи', icon: Users, to: '/admin/users' },
      { label: 'Заявки инструкторов', icon: UserCheck, to: '/admin/become-instructors' },
      { label: 'Отзывы', icon: Star, to: '/admin/reviews' },
      { label: 'Платёжные шлюзы', icon: CreditCard, to: '/admin/payment-channels' },
    ],
  },
  {
    title: 'Коммуникации',
    groups: [
      { label: 'Поддержка', icon: LifeBuoy, to: '/support' },
      { label: 'Уведомления', icon: Bell, to: '/notifications' },
    ],
  },
  {
    title: 'Аккаунт',
    groups: [
      { label: 'Заказы', icon: ShoppingCart, to: '/orders' },
      { label: 'Профиль', icon: User, to: '/profile' },
    ],
  },
]

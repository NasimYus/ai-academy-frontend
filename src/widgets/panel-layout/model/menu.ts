import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  CreditCard,
  Gift,
  GraduationCap,
  Heart,
  HelpCircle,
  Infinity as InfinityIcon,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Star,
  User,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Sidebar menu — cloned from legacy App\Mixins\Panel\SidebarItems, grouped by
// section, mapped to the SPA routes that already exist. `roles` gates a section.
export interface MenuItem {
  to: string
  label: string
  icon: LucideIcon
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
      { to: '/panel', label: 'Дашборд', icon: LayoutDashboard },
      { to: '/my-courses', label: 'Мои курсы', icon: GraduationCap },
      { to: '/purchases', label: 'Покупки', icon: Receipt },
      { to: '/favorites', label: 'Избранное', icon: Heart },
      { to: '/certificates', label: 'Сертификаты', icon: Award },
      { to: '/meetings', label: 'Консультации', icon: CalendarDays },
      { to: '/subscriptions', label: 'Подписки', icon: InfinityIcon },
      { to: '/rewards', label: 'Баллы', icon: Star },
    ],
  },
  {
    title: 'Преподавание',
    roles: ['teacher', 'organization', 'admin'],
    items: [
      { to: '/instructor', label: 'Мои курсы', icon: BookOpen },
      { to: '/instructor/sales', label: 'Продажи', icon: Wallet },
      { to: '/instructor/bundles', label: 'Наборы', icon: Package },
      { to: '/instructor/packages', label: 'Пакеты', icon: Gift },
      { to: '/instructor/quizzes', label: 'Тесты', icon: HelpCircle },
      { to: '/instructor/assignments', label: 'Задания', icon: ClipboardList },
      { to: '/instructor/comments', label: 'Комментарии', icon: MessageSquare },
      { to: '/instructor/meetings', label: 'Настройка консультаций', icon: Settings },
    ],
  },
  {
    title: 'Администрирование',
    roles: ['admin'],
    items: [
      { to: '/admin/courses', label: 'Модерация курсов', icon: CheckCircle },
      { to: '/admin/users', label: 'Пользователи', icon: Users },
      { to: '/admin/reviews', label: 'Отзывы', icon: Star },
      { to: '/admin/payment-channels', label: 'Платёжные шлюзы', icon: CreditCard },
    ],
  },
  {
    title: 'Аккаунт',
    items: [
      { to: '/orders', label: 'Заказы', icon: ShoppingCart },
      { to: '/notifications', label: 'Уведомления', icon: Bell },
      { to: '/support', label: 'Поддержка', icon: LifeBuoy },
      { to: '/profile', label: 'Профиль', icon: User },
    ],
  },
]

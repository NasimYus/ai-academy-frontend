import { AvatarForm, PasswordForm, ProfileForm } from '#/features/profile'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-brand-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-display text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  )
}

export function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-bold text-ink">Настройки профиля</h1>
      <Section title="Фото">
        <AvatarForm />
      </Section>
      <Section title="Профиль">
        <ProfileForm />
      </Section>
      <Section title="Пароль">
        <PasswordForm />
      </Section>
    </div>
  )
}

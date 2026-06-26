export function Spinner({ label = 'Загрузка…' }: { label?: string }) {
  return <p className="py-8 text-center text-ink/50">{label}</p>
}

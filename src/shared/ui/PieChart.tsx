// Lightweight inline-SVG donut chart with a legend — no external deps (CSP-safe).
// `data` values are treated as weights; empty/zero data renders an empty ring.
export function PieChart({
  labels,
  data,
  colors,
  size = 200,
}: {
  labels: string[]
  data: number[]
  colors: string[]
  size?: number
}) {
  const total = data.reduce((s, v) => s + v, 0)
  const r = size / 2
  const inner = r * 0.62
  const cx = r
  const cy = r

  let start = -Math.PI / 2 // start at 12 o'clock
  const arcs = data.map((v, i) => {
    const frac = total > 0 ? v / total : 0
    const end = start + frac * Math.PI * 2
    const large = end - start > Math.PI ? 1 : 0
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const path =
      frac >= 0.999
        ? // full circle — draw as two arcs to avoid degenerate path
          `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    start = end
    return { path, color: colors[i % colors.length], frac }
  })

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img">
        {total > 0 ? (
          arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} />)
        ) : (
          <circle cx={cx} cy={cy} r={r} fill="var(--color-brand-50)" />
        )}
        {/* donut hole */}
        <circle cx={cx} cy={cy} r={inner} fill="#fff" />
      </svg>
      <ul className="space-y-2">
        {labels.map((l, i) => (
          <li key={l} className="flex items-center gap-2 text-sm text-ink/70">
            <span
              className="inline-block size-3 rounded-sm"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="font-medium">{l}</span>
            <span className="text-ink/40">{Math.round((data[i] ?? 0) * 100) / 100}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

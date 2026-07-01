// Lightweight inline-SVG line chart — no external deps (CSP-safe).
export function LineChart({
  labels,
  data,
  height = 260,
  color = 'var(--color-brand-500)',
}: {
  labels: string[]
  data: number[]
  height?: number
  color?: string
}) {
  const width = 900
  const padX = 32
  const padY = 24
  const max = Math.max(1, ...data)
  const stepX = data.length > 1 ? (width - padX * 2) / (data.length - 1) : 0
  const y = (v: number) => height - padY - (v / max) * (height - padY * 2)
  const x = (i: number) => padX + i * stepX

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const areaPoints = `${padX},${height - padY} ${points} ${x(data.length - 1)},${height - padY}`

  // ~6 evenly spaced x-axis labels to avoid clutter
  const labelEvery = Math.max(1, Math.ceil(labels.length / 8))

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      preserveAspectRatio="none"
      role="img"
    >
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={width - padX}
          y1={padY + t * (height - padY * 2)}
          y2={padY + t * (height - padY * 2)}
          stroke="var(--color-brand-100)"
          strokeWidth={1}
        />
      ))}
      <polygon points={areaPoints} fill={color} opacity={0.08} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={2.5} />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={3} fill="#fff" stroke={color} strokeWidth={2} />
      ))}
      {labels.map((l, i) =>
        i % labelEvery === 0 ? (
          <text
            key={l + i}
            x={x(i)}
            y={height - 6}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-ink)"
            opacity={0.4}
          >
            {l}
          </text>
        ) : null,
      )}
    </svg>
  )
}

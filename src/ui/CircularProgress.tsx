interface Props {
  /** 0 to 1. */
  value: number
  size?: number
  label?: string
}

export function CircularProgress({ value, size = 40, label }: Props) {
  const stroke = 3.5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(1, Math.max(0, value))

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      role="img"
      aria-label={label ?? `${Math.round(clamped * 100)}% complete`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-slate-100"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - clamped)}
        // Start at 12 o'clock instead of 3.
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="text-slate-900"
      />
    </svg>
  )
}

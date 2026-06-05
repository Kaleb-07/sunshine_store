type Filter = 'all' | 'pending' | 'returned' | 'overdue'

type Props = {
  active: Filter
  onChange: (f: Filter) => void
  counts: { all: number; pending: number; returned: number; overdue: number }
}

export default function FilterBar({ active, onChange, counts }: Props) {
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'overdue', label: `Overdue (${counts.overdue})` },
    { key: 'returned', label: `Returned (${counts.returned})` },
  ]

  return (
    <div className="flex gap-1.5 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            active === f.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
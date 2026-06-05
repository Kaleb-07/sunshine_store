import { useStats } from '../../hooks/useStats'
import { AlertTriangle, ArchiveRestore, Clock, TrendingUp } from 'lucide-react'

export default function StatsHeader() {
  const { data: stats, isLoading } = useStats()

  if (isLoading || !stats) return null

  const cards = [
    {
      label: 'Active Deposits',
      value: stats.totalActive,
      sub: `${stats.totalActiveDeposit.toLocaleString()} Br`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Overdue (1+ days)',
      value: stats.overdueCount,
      sub: 'need follow-up',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Returned Today',
      value: stats.returnedToday,
      sub: 'bottles back',
      icon: ArchiveRestore,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Transactions',
      value: stats.totalTransactions,
      sub: 'all time',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border p-3 flex items-center gap-3"
        >
          <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums leading-none">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-xs font-medium text-muted-foreground">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

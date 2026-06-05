import { useState, useMemo, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronDown, ChevronRight, StickyNote, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { useDeposits, useMarkReturned } from '../../hooks/useDeposits'
import { groupRecords, getDaysSince } from '../../lib/utils'
import type { GroupedRow } from '../../types'
import StatsHeader from './StatsHeader'
import FilterBar from './FilterBar'
import { ReturnReceipt, type ReturnReceiptData } from '../Receipt/ReturnReceipt'
import { printElement } from '@/lib/print'

type Filter = 'all' | 'pending' | 'returned' | 'overdue'

function DaysBadge({ days, returned }: { days: number; returned?: boolean }) {
  let bg = 'bg-muted text-foreground'
  if (!returned) {
    if (days >= 11) bg = 'bg-destructive text-destructive-foreground'
    else if (days >= 6) bg = 'bg-yellow-400 text-foreground'
  }
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold tabular-nums min-w-[2.5rem] ${bg}`}>
      {days}d
    </span>
  )
}

function TransactionRow({
  row, index, onToggleReturned, isToggling, onPrintReceipt,
}: {
  row: GroupedRow
  index: number
  onToggleReturned: (row: GroupedRow) => void
  isToggling: boolean
  onPrintReceipt: (row: GroupedRow) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasMultiple = row.items.length > 1
  const hasNotes = !!row.notes
  const canExpand = hasMultiple || hasNotes
  const days = getDaysSince(row.createdAt, row.returned, row.returnedDate)
  const stillOwes = Math.max(0, row.totalItemCost + row.totalDeposit - row.amountPaid)
  const refundOnReturn = Math.max(0, row.amountPaid - row.totalItemCost)

  return (
    <>
      <tr
        className={`border-t border-border hover:bg-muted/20 ${canExpand ? 'cursor-pointer' : ''} ${expanded ? 'bg-muted/10' : ''}`}
        onClick={() => canExpand && setExpanded(!expanded)}
      >
        <td className="px-3 py-2.5 text-muted-foreground tabular-nums text-xs">
          <div className="flex items-center gap-1">
            {canExpand && (
              expanded
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span>{index + 1}</span>
          </div>
        </td>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className={`font-medium text-sm ${row.regularCustomer ? 'bg-green-100 px-1.5 py-0.5 rounded' : ''}`}>
              {row.fullName}
            </span>
            {hasNotes && !expanded && (
              <StickyNote className="w-3 h-3 text-muted-foreground/50" />
            )}
          </div>
          <div className="text-xs text-muted-foreground">{row.phoneNumber}</div>
        </td>
        <td className="px-2 py-2.5 text-xs">
          {row.items.map((item, i) => (
            <span key={i}>
              {item.itemType}
              <span className="text-muted-foreground"> ×{item.bottlesTaken}</span>
              {i < row.items.length - 1 && ', '}
            </span>
          ))}
        </td>
        <td className="px-2 py-2.5 text-center tabular-nums font-medium text-sm">
          {row.totalBottles}
        </td>
        <td className="px-3 py-2.5 text-right tabular-nums font-medium text-sm">
          {row.totalDeposit.toLocaleString()} Br
        </td>
        <td className="px-3 py-2.5 text-right tabular-nums text-sm">
          {row.amountPaid.toLocaleString()} Br
        </td>
        <td className={`px-2 py-2.5 text-right tabular-nums font-medium text-sm ${stillOwes > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {stillOwes > 0 ? `${stillOwes.toLocaleString()} Br` : '—'}
        </td>
        <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-primary text-sm">
          {refundOnReturn.toLocaleString()} Br
        </td>
        <td className="px-2 py-2.5 text-center">
          <DaysBadge days={days} returned={row.returned} />
        </td>
        <td className="px-2 py-2.5 text-center text-xs text-muted-foreground">
          {row.returned && row.returnedDate
            ? new Date(row.returnedDate).toLocaleDateString()
            : '—'}
        </td>
        <td className="px-2 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-2">
            {row.returned && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => onPrintReceipt(row)}
                title="Print return receipt"
              >
                <Printer className="w-3.5 h-3.5" />
              </Button>
            )}
            <Checkbox
              checked={row.returned}
              disabled={isToggling}
              onCheckedChange={() => onToggleReturned(row)}
              className="w-5 h-5"
            />
          </div>
        </td>
      </tr>

      {expanded && hasNotes && (
        <tr className="bg-yellow-50 border-t border-dashed border-border/50">
          <td className="px-3 py-2" />
          <td colSpan={10} className="px-3 py-2">
            <div className="flex items-start gap-2">
              <StickyNote className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <p className="text-xs">{row.notes}</p>
            </div>
          </td>
        </tr>
      )}

      {expanded && hasMultiple && row.items.map((item, i) => (
        <tr key={item.id} className="bg-muted/5 border-t border-dashed border-border/50">
          <td className="px-3 py-1.5 text-xs text-muted-foreground/60">
            <span className="pl-4">{index + 1}.{i + 1}</span>
          </td>
          <td className="px-3 py-1.5" />
          <td className="px-2 py-1.5 text-xs text-muted-foreground">{item.itemType}</td>
          <td className="px-2 py-1.5 text-center text-xs text-muted-foreground">{item.bottlesTaken}</td>
          <td className="px-2 py-1.5 text-right text-xs text-muted-foreground">
            {item.totalDeposit.toLocaleString()} Br
          </td>
          <td colSpan={6} className="px-2 py-1.5 text-xs text-muted-foreground">
            {item.pricePerBottle.toLocaleString()} Br/bottle × {item.bottlesTaken}
          </td>
        </tr>
      ))}
    </>
  )
}

export default function RecordsDashboard() {
  const { data: records = [], isLoading } = useDeposits()
  const { mutate: toggleReturned, isPending, variables } = useMarkReturned()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [returnReceiptData, setReturnReceiptData] = useState<ReturnReceiptData | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  const grouped = useMemo(() => groupRecords(records), [records])

  const counts = useMemo(() => ({
    all: grouped.length,
    pending: grouped.filter((r: GroupedRow) => !r.returned).length,
    returned: grouped.filter((r: GroupedRow) => r.returned).length,
    overdue: grouped.filter((r: GroupedRow) => {
      if (r.returned) return false
      return getDaysSince(r.createdAt) >= 1
    }).length,
  }), [grouped])

  const filtered = useMemo(() => {
    return grouped.filter((r: GroupedRow) => {
      const matchSearch = !search ||
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.phoneNumber.includes(search) ||
        r.items.some((i) => i.itemType.toLowerCase().includes(search.toLowerCase()))

      const matchFilter =
        filter === 'all' ? true :
        filter === 'pending' ? !r.returned :
        filter === 'returned' ? r.returned :
        filter === 'overdue' ? (!r.returned && getDaysSince(r.createdAt) >= 1) :
        true

      return matchSearch && matchFilter
    })
  }, [grouped, search, filter])

  const handleToggle = (row: GroupedRow) => {
    toggleReturned(
      { id: row.ids[0], returned: !row.returned, transactionId: row.transactionId },
      { onError: () => toast.error('Failed to update') }
    )
  }

  const handlePrintReceipt = (row: GroupedRow) => {
    if (!row.returned || !row.returnedDate) {
      toast.error('Cannot print receipt for non-returned items')
      return
    }

    const receiptData: ReturnReceiptData = {
      transactionId: row.transactionId || '',
      fullName: row.fullName,
      phoneNumber: row.phoneNumber,
      items: row.items.map((item) => ({
        itemType: item.itemType,
        quantity: item.bottlesTaken,
        pricePerBottle: item.pricePerBottle,
        depositPerBottle: item.depositPerBottle,
        itemCost: item.itemCost,
        depositTotal: item.totalDeposit,
      })),
      totalItemCost: row.totalItemCost,
      totalDeposit: row.totalDeposit,
      amountPaid: row.amountPaid,
      refundAmount: Math.max(0, row.amountPaid - row.totalItemCost),
      returnedDate: row.returnedDate,
      depositDate: row.createdAt || new Date().toISOString(),
      notes: row.notes,
    }

    setReturnReceiptData(receiptData)

    // Wait for receipt to render, then print
    setTimeout(() => {
      if (receiptRef.current) {
        try {
          printElement(receiptRef.current)
        } catch (error) {
          toast.error('Failed to print receipt')
        }
      }
    }, 100)
  }

  if (isLoading) {
    return (
      <Card className="shadow-md w-full">
        <CardContent className="p-6 space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md w-full">
      <CardContent className="p-4 space-y-4">
        <StatsHeader />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="h-10 pl-9 text-sm"
              placeholder="Search by name, phone, or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterBar active={filter} onChange={setFilter} counts={counts} />
        </div>

        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left font-medium text-muted-foreground px-3 py-2.5">#</th>
                <th className="text-left font-medium text-muted-foreground px-3 py-2.5">Customer</th>
                <th className="text-left font-medium text-muted-foreground px-2 py-2.5">Drinks</th>
                <th className="text-center font-medium text-muted-foreground px-2 py-2.5">Bottles</th>
                <th className="text-right font-medium text-muted-foreground px-2 py-2.5">Deposit</th>
                <th className="text-right font-medium text-muted-foreground px-2 py-2.5">Paid</th>
                <th className="text-right font-medium text-muted-foreground px-2 py-2.5">Owed</th>
                <th className="text-right font-medium text-muted-foreground px-2 py-2.5">Refund</th>
                <th className="text-center font-medium text-muted-foreground px-2 py-2.5">Days</th>
                <th className="text-center font-medium text-muted-foreground px-2 py-2.5">Returned Date</th>
                <th className="text-center font-medium text-muted-foreground px-2 py-2.5">Returned</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-muted-foreground py-8">
                    {search ? 'No matching records' : 'No deposits yet'}
                  </td>
                </tr>
              )}
              {filtered.map((r: GroupedRow, idx: number) => (
                <TransactionRow
                  key={r.key}
                  row={r}
                  index={idx}
                  onToggleReturned={handleToggle}
                  onPrintReceipt={handlePrintReceipt}
                  isToggling={isPending && variables?.id === r.ids[0]}
                />
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} • {filter === 'all' ? 'Showing all' : filter}
        </p>

        {/* Hidden return receipt for printing */}
        {returnReceiptData && (
          <div className="hidden">
            <ReturnReceipt ref={receiptRef} data={returnReceiptData} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
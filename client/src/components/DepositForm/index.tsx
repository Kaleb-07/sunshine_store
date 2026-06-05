import { useState } from 'react'
import { Milk } from 'lucide-react'
import PageOne from './PageOne'
import PageTwo from './PageTwo'
import SuccessScreen from './SuccessScreen'
import type { FormData } from '../../types'
import { initialFormData } from './constants'

export default function DepositForm() {
  const [page, setPage] = useState<1 | 2 | 'success'>(1)
  const [data, setData] = useState<FormData>(initialFormData)

  const totalBottles = data.items.reduce(
    (sum, i) => sum + (typeof i.quantity === 'number' ? i.quantity : 0), 0
  )
  const totalDeposit = data.items.reduce(
    (sum, i) => sum + (typeof i.quantity === 'number' ? i.quantity : 0) * i.depositPerBottle, 0
  )

  const reset = () => {
    setData(initialFormData)
    setPage(1)
  }

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <Milk className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">SUNSHINE LIQUOR STORE</h1>
      </div>

      {/* Progress bar */}
      {page !== 'success' && (
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= (page as number)
                  ? 'bg-primary w-16'
                  : 'bg-muted w-10'
              }`}
            />
          ))}
        </div>
      )}

      {page === 1 && (
        <PageOne data={data} setData={setData} onNext={() => setPage(2)} />
      )}
      {page === 2 && (
        <PageTwo
          data={data}
          setData={setData}
          totalBottles={totalBottles}
          totalDeposit={totalDeposit}
          onBack={() => setPage(1)}
          onSuccess={() => setPage('success')}
        />
      )}
      {page === 'success' && <SuccessScreen onReset={reset} />}
    </div>
  )
}
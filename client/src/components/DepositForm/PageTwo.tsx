import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { createDeposit } from '../../lib/api'
import type { FormData } from '../../types'
import { FormError } from '@/components/ui/form-error'
import { validateAmountPaid } from '@/lib/validation'

type Props = {
  data: FormData
  setData: React.Dispatch<React.SetStateAction<FormData>>
  totalBottles: number
  totalDeposit: number
  onBack: () => void
  onSuccess: () => void
}

export default function PageTwo({
  data, setData, totalBottles, totalDeposit, onBack, onSuccess,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [amountPaidError, setAmountPaidError] = useState('')

  const validItems = data.items.filter(
    (i) => i.itemType !== '' && typeof i.quantity === 'number' && i.quantity >= 1
  )

  const totalAmount = validItems.reduce((sum, i) => {
    const qty = typeof i.quantity === 'number' ? i.quantity : 0
    const price = typeof i.pricePerBottle === 'number' ? i.pricePerBottle : 0
    return sum + qty * price
  }, 0)

  const validatePayment = (value: number | '') => {
    if (value === '') {
      setAmountPaidError('')
      return true
    }
    const result = validateAmountPaid(value)
    setAmountPaidError(result.error || '')
    return result.valid
  }

  const handleSubmit = async () => {
    // Validate amount paid before submission
    const paymentValue = typeof data.amountPaid === 'number' ? data.amountPaid : ''
    if (!validatePayment(paymentValue)) {
      toast.error('Please fix validation errors before submitting')
      return
    }

    // Validate policy checkbox
    if (!data.policyExplained) {
      toast.error('Please confirm you explained the return policy')
      return
    }

    setSaving(true)
    try {
      await createDeposit({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        items: validItems.map((i) => ({
          itemType: i.itemType,
          quantity: typeof i.quantity === 'number' ? i.quantity : 1,
          pricePerBottle: typeof i.pricePerBottle === 'number' ? i.pricePerBottle : undefined,
          depositPerBottle: i.depositPerBottle,
        })),
        amountPaid: typeof data.amountPaid === 'number' ? data.amountPaid : undefined,
        policyExplained: data.policyExplained,
        notes: data.notes || undefined,
        regularCustomer: data.regularCustomer,
      })
      toast.success('Deposit saved successfully!')
      onSuccess()
    } catch (error: any) {
      // Parse server validation errors
      if (error.response?.data?.details) {
        // Format Zod validation errors
        const details = error.response.data.details
        const errorMessages = Object.entries(details)
          .flatMap(([field, messages]: any) => {
            if (Array.isArray(messages)) {
              return messages.map((msg: any) => `${field}: ${msg}`)
            }
            return [`${field}: ${messages}`]
          })
          .slice(0, 2) // Show first 2 errors
        
        toast.error(errorMessages.join('\n'))
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to save. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 space-y-6">
        <p className="text-lg font-medium text-center">Payment Summary</p>

        <div className="rounded-xl bg-accent/50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium">{data.fullName}</span>
          </div>
        </div>

        {/* Items table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left font-medium text-muted-foreground px-3 py-2.5">Item</th>
                <th className="text-center font-medium text-muted-foreground px-2 py-2.5 w-12">Qty</th>
                <th className="text-right font-medium text-muted-foreground px-2 py-2.5 w-24">Amount</th>
                <th className="text-right font-medium text-muted-foreground px-3 py-2.5 w-24">Deposit</th>
              </tr>
            </thead>
            <tbody>
              {validItems.map((item, idx) => {
                const qty = typeof item.quantity === 'number' ? item.quantity : 0
                const price = typeof item.pricePerBottle === 'number' ? item.pricePerBottle : 0
                const deposit = qty * item.depositPerBottle
                return (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-3 py-2.5 font-medium">{item.itemType}</td>
                    <td className="px-2 py-2.5 text-center tabular-nums">{qty}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">
                      {price > 0 ? `${(qty * price).toLocaleString()} Br` : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {deposit.toLocaleString()} Br
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="px-3 py-2.5 font-semibold">Total</td>
                <td className="px-2 py-2.5 text-center font-semibold tabular-nums">{totalBottles}</td>
                <td className="px-2 py-2.5 text-right font-semibold tabular-nums">
                  {totalAmount > 0 ? `${totalAmount.toLocaleString()} Br` : '—'}
                </td>
                <td className="px-3 py-2.5 text-right font-semibold text-primary tabular-nums">
                  {totalDeposit.toLocaleString()} Br
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Total to receive */}
        <div className="rounded-xl bg-muted/40 border border-border p-4 flex justify-between items-center">
          <span className="text-sm font-semibold">Total to Receive from Customer</span>
          <span className="text-lg font-bold text-primary tabular-nums">
            {(totalAmount + totalDeposit).toLocaleString()} Br
          </span>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
          This customer will receive{' '}
          <span className="font-bold text-primary">{totalDeposit.toLocaleString()} Br</span>{' '}
          refund when they return the bottles.
        </div>

        {/* Amount paid */}
        <div className="space-y-2">
          <Label>Amount Paid Now (Br)</Label>
          <Input
            className="h-12 text-base"
            type="number"
            placeholder="0"
            value={data.amountPaid === '' ? '' : data.amountPaid}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                amountPaid: e.target.value === '' ? '' : Number(e.target.value),
              }))
            }
            onBlur={(e) => {
              const val = e.target.value === '' ? '' : Number(e.target.value)
              validatePayment(val)
            }}
          />
          {amountPaidError && <FormError message={amountPaidError} />}
        </div>

        {/* Policy checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="policy"
            className="mt-0.5 w-5 h-5"
            checked={data.policyExplained}
            onCheckedChange={(v) =>
              setData((p) => ({ ...p, policyExplained: v === true }))
            }
          />
          <label htmlFor="policy" className="text-sm leading-relaxed cursor-pointer">
            I have explained the bottle return policy to the customer
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 text-base"
            onClick={onBack}
            disabled={saving}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            className="flex-1 h-12 text-base font-medium"
            disabled={!data.policyExplained || saving || !!amountPaidError}
            onClick={handleSubmit}
          >
            {saving
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <Save className="w-4 h-4 mr-2" />}
            Save Record
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { FormData, LineItem } from '../../types'
import { ITEM_TYPES, createEmptyItem } from './constants'
import { useCustomerSearch } from '../../hooks/useCustomerSearch'
import { FormError } from '@/components/ui/form-error'
import {
  validateCustomerName,
  validateEthiopianPhone,
  validateQuantity,
  validatePrice,
  validateDeposit,
} from '@/lib/validation'

type Props = {
  data: FormData
  setData: React.Dispatch<React.SetStateAction<FormData>>
  onNext: () => void
}

export default function PageOne({ data, setData, onNext }: Props) {
  const [nameInput, setNameInput] = useState(data.fullName)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { results } = useCustomerSearch(nameInput)
  
  // Validation errors
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [itemErrors, setItemErrors] = useState<Record<number, { quantity?: string; price?: string }>>({})
  const [depositError, setDepositError] = useState('')

  const update = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setData((p) => ({ ...p, [key]: val }))

  // Validation handlers
  const validateName = (value: string) => {
    const result = validateCustomerName(value)
    setNameError(result.error || '')
    return result.valid
  }

  const validatePhone = (value: string) => {
    const result = validateEthiopianPhone(value)
    setPhoneError(result.error || '')
    return result.valid
  }

  const validateItemQuantity = (idx: number, value: number | '') => {
    if (value === '') {
      setItemErrors((prev) => {
        const updated = { ...prev }
        if (updated[idx]) delete updated[idx].quantity
        return updated
      })
      return true
    }
    const result = validateQuantity(value)
    setItemErrors((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], quantity: result.error || undefined },
    }))
    return result.valid
  }

  const validateItemPrice = (idx: number, value: number | '') => {
    if (value === '') {
      setItemErrors((prev) => {
        const updated = { ...prev }
        if (updated[idx]) delete updated[idx].price
        return updated
      })
      return true
    }
    const result = validatePrice(value)
    setItemErrors((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], price: result.error || undefined },
    }))
    return result.valid
  }

  const validateDepositAmount = (value: number) => {
    const result = validateDeposit(value)
    setDepositError(result.error || '')
    return result.valid
  }

  const addItem = () =>
    setData((p) => ({ ...p, items: [...p.items, createEmptyItem()] }))

  const removeItem = (idx: number) =>
    setData((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))

  const updateItem = (idx: number, updated: LineItem) =>
    setData((p) => ({
      ...p,
      items: p.items.map((it, i) => (i === idx ? updated : it)),
    }))

  const getTotal = (item: LineItem) => {
    const qty = typeof item.quantity === 'number' ? item.quantity : 0
    const price = typeof item.pricePerBottle === 'number' ? item.pricePerBottle : 0
    return qty * price
  }

  const hasValidItem = data.items.some(
    (i) => i.itemType !== '' && typeof i.quantity === 'number' && i.quantity >= 1
  )

  const hasErrors = !!(
    nameError || 
    phoneError || 
    depositError || 
    Object.values(itemErrors).some((err) => err.quantity || err.price)
  )

  const valid =
    data.fullName.trim() !== '' &&
    data.phoneNumber.trim() !== '' &&
    hasValidItem &&
    !hasErrors

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 space-y-5">
        <p className="text-lg font-medium text-center">
          Welcome! Let's get you registered.
        </p>

        {/* Full Name with autocomplete */}
        <div className="space-y-2 relative">
          <Label>Full Name *</Label>
          <Input
            className="h-12 text-base"
            placeholder="Customer name"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value)
              update('fullName', e.target.value)
              setShowSuggestions(true)
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150)
              validateName(nameInput)
            }}
          />
          {nameError && <FormError message={nameError} />}
          {showSuggestions && results.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-border rounded-lg shadow-lg mt-1">
              {results.map((r, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-2.5 hover:bg-muted text-sm"
                  onClick={() => {
                    setNameInput(r.fullName)
                    update('fullName', r.fullName)
                    update('phoneNumber', r.phoneNumber)
                    setShowSuggestions(false)
                    setNameError('')
                    setPhoneError('')
                  }}
                >
                  <span className="font-medium">{r.fullName}</span>
                  <span className="text-muted-foreground ml-2">{r.phoneNumber}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label>Phone Number *</Label>
          <Input
            className="h-12 text-base"
            type="tel"
            placeholder="09********"
            value={data.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
            onBlur={(e) => validatePhone(e.target.value)}
          />
          {phoneError && <FormError message={phoneError} />}
        </div>

        {/* Items table */}
        <div className="space-y-2">
          <Label className="font-semibold">Items *</Label>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left font-medium text-muted-foreground px-3 py-2.5">Drinks</th>
                  <th className="text-center font-medium text-muted-foreground px-2 py-2.5 w-16">Qty</th>
                  <th className="text-center font-medium text-muted-foreground px-2 py-2.5 w-20">Price</th>
                  <th className="text-right font-medium text-muted-foreground px-3 py-2.5 w-20">Total</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="px-2 py-2">
                      <Select
                        value={item.itemType}
                        onValueChange={(v) => updateItem(idx, { ...item, itemType: v })}
                      >
                        <SelectTrigger className="h-10 text-sm border-0 bg-transparent shadow-none px-1">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEM_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-1 py-2">
                      <Input
                        className="h-10 text-sm text-center border-0 bg-transparent shadow-none px-1"
                        type="number"
                        min={1}
                        placeholder="0"
                        value={item.quantity === '' ? '' : item.quantity}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value)
                          updateItem(idx, { ...item, quantity: val })
                        }}
                        onBlur={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value)
                          validateItemQuantity(idx, val)
                        }}
                      />
                      {itemErrors[idx]?.quantity && (
                        <div className="text-xs text-destructive mt-0.5 px-1">
                          {itemErrors[idx].quantity}
                        </div>
                      )}
                    </td>
                    <td className="px-1 py-2">
                      <Input
                        className="h-10 text-sm text-center border-0 bg-transparent shadow-none px-1"
                        type="number"
                        placeholder="—"
                        value={item.pricePerBottle === '' ? '' : item.pricePerBottle}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value)
                          updateItem(idx, { ...item, pricePerBottle: val })
                        }}
                        onBlur={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value)
                          validateItemPrice(idx, val)
                        }}
                      />
                      {itemErrors[idx]?.price && (
                        <div className="text-xs text-destructive mt-0.5 px-1">
                          {itemErrors[idx].price}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">
                      {getTotal(item) > 0 ? getTotal(item).toLocaleString() : '—'}
                    </td>
                    <td className="px-1 py-2">
                      {data.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(idx)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={addItem}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </Button>

          {/* Grand total */}
          <div className="flex justify-between items-center px-3 pt-1">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-sm font-semibold tabular-nums">
              {data.items.reduce((s, i) => s + getTotal(i), 0).toLocaleString()} Br
            </span>
          </div>

          {/* Deposit per bottle */}
          <div className="flex items-center gap-3 pt-1">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">
              Deposit per bottle (Br):
            </Label>
            <Input
              className="h-9 text-sm w-20"
              type="number"
              disabled={data.regularCustomer}
              value={data.regularCustomer ? 0 : (data.items[0]?.depositPerBottle ?? 50)}
              onChange={(e) => {
                const val = Number(e.target.value) || 0
                setData((p) => ({
                  ...p,
                  items: p.items.map((it) => ({ ...it, depositPerBottle: val })),
                }))
              }}
              onBlur={(e) => {
                const val = Number(e.target.value) || 0
                validateDepositAmount(val)
              }}
            />
          </div>
          {depositError && <FormError message={depositError} />}

          {/* Regular customer */}
          <div className="flex items-center gap-3 pt-1">
            <Checkbox
              id="regularCustomer"
              className="w-5 h-5"
              checked={data.regularCustomer}
              onCheckedChange={(v) => {
                const isRegular = v === true
                setData((p) => ({
                  ...p,
                  regularCustomer: isRegular,
                  items: p.items.map((it) => ({
                    ...it,
                    depositPerBottle: isRegular ? 0 : 50,
                  })),
                }))
              }}
            />
            <label htmlFor="regularCustomer" className="text-sm font-medium cursor-pointer">
              Regular Customer{' '}
              <span className="text-xs text-muted-foreground">(no deposit)</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            className="text-base min-h-[80px]"
            placeholder="e.g. referred by someone"
            value={data.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </div>

        <Button
          className="w-full h-12 text-base font-medium"
          disabled={!valid}
          onClick={onNext}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
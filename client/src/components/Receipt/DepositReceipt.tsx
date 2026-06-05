import { forwardRef } from 'react'
import { Milk } from 'lucide-react'

export type DepositReceiptData = {
  transactionId: string
  fullName: string
  phoneNumber: string
  items: {
    itemType: string
    quantity: number
    pricePerBottle: number | null
    depositPerBottle: number
    itemTotal: number
    depositTotal: number
  }[]
  totalAmount: number
  totalDeposit: number
  amountPaid: number
  regularCustomer: boolean
  notes: string
  createdAt: string | Date
}

type Props = {
  data: DepositReceiptData
}

export const DepositReceipt = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const date = new Date(data.createdAt)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const grandTotal = data.totalAmount + data.totalDeposit
  const balance = grandTotal - data.amountPaid

  return (
    <div ref={ref} className="bg-white p-8 max-w-[400px] mx-auto text-black">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-lg bg-[hsl(20,90%,48%)] flex items-center justify-center">
            <Milk className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold">SUNSHINE LIQUOR STORE</h1>
        <p className="text-sm mt-1">Bottle Deposit Receipt</p>
      </div>

      {/* Transaction Info */}
      <div className="text-xs space-y-1 mb-4 border-b border-dashed border-gray-400 pb-3">
        <div className="flex justify-between">
          <span>Transaction ID:</span>
          <span className="font-mono">{data.transactionId.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="text-xs space-y-1 mb-4 border-b border-dashed border-gray-400 pb-3">
        <div className="flex justify-between">
          <span>Customer:</span>
          <span className="font-medium">{data.fullName}</span>
        </div>
        <div className="flex justify-between">
          <span>Phone:</span>
          <span>{data.phoneNumber}</span>
        </div>
        {data.regularCustomer && (
          <div className="text-center mt-1">
            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">
              REGULAR CUSTOMER
            </span>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1 font-semibold">Item</th>
              <th className="text-center py-1 font-semibold w-12">Qty</th>
              <th className="text-right py-1 font-semibold w-16">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="border-b border-dashed border-gray-300">
                <td className="py-2">
                  <div>{item.itemType}</div>
                  {item.pricePerBottle !== null && item.pricePerBottle > 0 && (
                    <div className="text-gray-600 text-[10px]">
                      @ {item.pricePerBottle} Br/bottle
                    </div>
                  )}
                  <div className="text-gray-600 text-[10px]">
                    Deposit: {item.depositPerBottle} Br/bottle
                  </div>
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  <div>{item.itemTotal > 0 ? `${item.itemTotal.toLocaleString()} Br` : '—'}</div>
                  <div className="text-gray-600 text-[10px]">
                    +{item.depositTotal.toLocaleString()} Br
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="text-xs space-y-1 border-t-2 border-black pt-3 mb-4">
        {data.totalAmount > 0 && (
          <div className="flex justify-between">
            <span>Item Total:</span>
            <span>{data.totalAmount.toLocaleString()} Br</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Deposit Total:</span>
          <span>{data.totalDeposit.toLocaleString()} Br</span>
        </div>
        <div className="flex justify-between font-bold text-sm pt-1">
          <span>Grand Total:</span>
          <span>{grandTotal.toLocaleString()} Br</span>
        </div>
      </div>

      {/* Payment */}
      <div className="text-xs space-y-1 border-t border-dashed border-gray-400 pt-3 mb-4">
        <div className="flex justify-between">
          <span>Amount Paid:</span>
          <span>{data.amountPaid.toLocaleString()} Br</span>
        </div>
        {balance !== 0 && (
          <div className="flex justify-between font-medium">
            <span>{balance > 0 ? 'Balance Due:' : 'Change:'}</span>
            <span>{Math.abs(balance).toLocaleString()} Br</span>
          </div>
        )}
      </div>

      {/* Refund Info */}
      <div className="bg-gray-100 p-3 rounded text-xs text-center mb-4">
        <p className="font-semibold mb-1">DEPOSIT REFUND</p>
        <p className="text-lg font-bold">{data.totalDeposit.toLocaleString()} Br</p>
        <p className="text-[10px] text-gray-600 mt-1">
          Refundable when bottles are returned
        </p>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="text-xs mb-4 border-t border-dashed border-gray-400 pt-3">
          <span className="font-semibold">Notes:</span>
          <p className="mt-1 text-gray-700">{data.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-[10px] text-gray-600 border-t border-black pt-3">
        <p className="mb-1">Thank you for your business!</p>
        <p>Please keep this receipt for bottle returns</p>
      </div>
    </div>
  )
})

DepositReceipt.displayName = 'DepositReceipt'

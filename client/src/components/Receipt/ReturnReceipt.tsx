import { forwardRef } from 'react'
import { Milk } from 'lucide-react'

export type ReturnReceiptData = {
  transactionId: string
  fullName: string
  phoneNumber: string
  items: {
    itemType: string
    quantity: number
    pricePerBottle: number | null
    depositPerBottle: number
    itemCost: number
    depositTotal: number
  }[]
  totalItemCost: number
  totalDeposit: number
  amountPaid: number
  refundAmount: number
  returnedDate: string | Date
  depositDate: string | Date
  notes?: string
}

type Props = {
  data: ReturnReceiptData
}

export const ReturnReceipt = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const returnDate = new Date(data.returnedDate)
  const formattedReturnDate = returnDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const formattedReturnTime = returnDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const depositDate = new Date(data.depositDate)
  const formattedDepositDate = depositDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

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
        <p className="text-sm mt-1">Bottle Return Receipt</p>
      </div>

      {/* Transaction Info */}
      <div className="text-xs space-y-1 mb-4 border-b border-dashed border-gray-400 pb-3">
        <div className="flex justify-between">
          <span>Transaction ID:</span>
          <span className="font-mono">{data.transactionId.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Return Date:</span>
          <span>{formattedReturnDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Return Time:</span>
          <span>{formattedReturnTime}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Original Deposit:</span>
          <span>{formattedDepositDate}</span>
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
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1 font-semibold">Item Returned</th>
              <th className="text-center py-1 font-semibold w-12">Qty</th>
              <th className="text-right py-1 font-semibold w-20">Deposit</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="border-b border-dashed border-gray-300">
                <td className="py-2">
                  <div>{item.itemType}</div>
                  <div className="text-gray-600 text-[10px]">
                    {item.depositPerBottle} Br/bottle
                  </div>
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {item.depositTotal.toLocaleString()} Br
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculation */}
      <div className="text-xs space-y-1 border-t-2 border-black pt-3 mb-4">
        <div className="flex justify-between">
          <span>Total Bottles Returned:</span>
          <span className="font-medium">
            {data.items.reduce((sum, item) => sum + item.quantity, 0)} bottles
          </span>
        </div>
        <div className="flex justify-between">
          <span>Deposit Paid:</span>
          <span>{data.totalDeposit.toLocaleString()} Br</span>
        </div>
        {data.totalItemCost > 0 && (
          <>
            <div className="flex justify-between text-gray-600">
              <span>Item Cost:</span>
              <span>-{data.totalItemCost.toLocaleString()} Br</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Amount Paid Previously:</span>
              <span>{data.amountPaid.toLocaleString()} Br</span>
            </div>
          </>
        )}
      </div>

      {/* Refund Amount */}
      <div className="bg-green-100 border-2 border-green-600 p-4 rounded text-center mb-4">
        <p className="text-xs font-semibold text-green-800 mb-1">REFUND AMOUNT</p>
        <p className="text-2xl font-bold text-green-700">
          {data.refundAmount.toLocaleString()} Br
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
        <p className="mb-1">Thank you for returning the bottles!</p>
        <p>Visit us again soon</p>
      </div>
    </div>
  )
})

ReturnReceipt.displayName = 'ReturnReceipt'

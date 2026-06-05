import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Plus, Printer, Download } from 'lucide-react'
import { DepositReceipt, type DepositReceiptData } from '../Receipt/DepositReceipt'
import { printElement, downloadAsPDF } from '@/lib/print'
import { toast } from 'sonner'

type Props = {
  onReset: () => void
  receiptData?: DepositReceiptData
}

export default function SuccessScreen({ onReset, receiptData }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (!receiptRef.current) return
    try {
      printElement(receiptRef.current)
    } catch (error) {
      toast.error('Failed to print. Please try again.')
    }
  }

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !receiptData) return
    try {
      const filename = `deposit-${receiptData.transactionId.slice(0, 8)}-${new Date().getTime()}.pdf`
      await downloadAsPDF(receiptRef.current, filename)
      toast.success('Receipt downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download PDF. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold">Done! Record saved.</h2>
          <p className="text-muted-foreground">Receipt ready to print 🎉</p>

          {receiptData && (
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 h-12 text-base"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 text-base"
                onClick={handleDownloadPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}

          <Button className="h-12 text-base px-8 font-medium w-full" onClick={onReset}>
            <Plus className="w-4 h-4 mr-2" />
            New Customer
          </Button>
        </CardContent>
      </Card>

      {/* Receipt Preview (hidden, used for printing) */}
      {receiptData && (
        <div className="hidden">
          <DepositReceipt ref={receiptRef} data={receiptData} />
        </div>
      )}
    </div>
  )
}

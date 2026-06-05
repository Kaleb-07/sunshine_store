import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Plus } from 'lucide-react'

export default function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-8 flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold">Done! Record saved.</h2>
        <p className="text-muted-foreground">Have a great day! 🎉</p>
        <Button className="h-12 text-base px-8 font-medium" onClick={onReset}>
          <Plus className="w-4 h-4 mr-2" />
          New Customer
        </Button>
      </CardContent>
    </Card>
  )
}
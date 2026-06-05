import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { ClipboardList, PlusCircle } from 'lucide-react'
import DepositForm from './components/DepositForm'
import RecordsDashboard from './components/RecordsDashboard'

const queryClient = new QueryClient()

export default function App() {
  const [view, setView] = useState<'form' | 'records'>('form')

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 mb-6 justify-center">
            <Button
              variant={view === 'form' ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setView('form')}
            >
              <PlusCircle className="w-4 h-4" />
              New Deposit
            </Button>
            <Button
              variant={view === 'records' ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setView('records')}
            >
              <ClipboardList className="w-4 h-4" />
              Records
            </Button>
          </div>

          <div className="flex justify-center">
            {view === 'form' ? <DepositForm /> : <RecordsDashboard />}
          </div>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  )
}
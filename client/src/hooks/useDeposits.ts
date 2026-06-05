import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDeposits, markReturned } from '../lib/api'
import { toast } from 'sonner'

export function useDeposits() {
  return useQuery({
    queryKey: ['deposits'],
    queryFn: getDeposits,
  })
}

export function useMarkReturned() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      returned,
      transactionId,
    }: {
      id: string
      returned: boolean
      transactionId?: string
    }) => markReturned(id, returned, transactionId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] })
    },

    onError: () => {
      toast.error('Failed to update. Please try again.')
    },
  })
}
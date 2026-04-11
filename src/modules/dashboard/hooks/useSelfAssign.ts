import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../../shared/config/api-client'

interface SelfAssignError {
  code: 'ORDER_NOT_PENDING' | 'ALREADY_ASSIGNED' | 'CAPACITY_FULL'
  message: string
}

export function useSelfAssign() {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean }, SelfAssignError, string>({
    mutationFn: (orderId: string) =>
      apiClient.post<{ success: boolean }>(`/api/v1/orders/${orderId}/self-assign`),
    onSuccess: () => {
      // Refresh orders list và workload
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      void queryClient.invalidateQueries({ queryKey: ['designer-workload'] })
    },
  })
}

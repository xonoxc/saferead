import { useQuery } from "@tanstack/react-query"
import { getPlans, type PlansResponse } from "@/services/plans.service"

export const usePlans = (enabled = true) => {
   return useQuery<PlansResponse>({
      queryKey: ["plans"],
      queryFn: getPlans,
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
   })
}

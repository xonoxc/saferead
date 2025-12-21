import { useState } from "react"
import { usePlans } from "@/hooks/queries/plans"

import type { Plan } from "@/services/plans.service"

export default function usePremiumScreen() {
   const { data: plansData, isLoading, error } = usePlans()
   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

   const plans = plansData?.results || []
   const premiumPlan = plans.find(plan => plan.plan_type === "premium")

   const effectiveSelectedPlan = selectedPlan ?? premiumPlan
   const isCardSelected = (plan: Plan) =>
      selectedPlan ? selectedPlan.id === plan.id : premiumPlan?.id === plan.id

   return {
      plans,
      isLoading,
      error,
      effectiveSelectedPlan,
      setSelectedPlan,
      isCardSelected,
   }
}

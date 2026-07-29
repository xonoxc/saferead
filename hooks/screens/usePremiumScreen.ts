import { useMemo, useState } from "react"

import { usePlanFeatureCatalog, usePlans } from "@/hooks/queries/plans"
import { useAuth } from "@/hooks/useAuth"

import type { Plan } from "@/services/plans.service"

/*
 * The pricing screen's state.
 *
 * Both halves come from the server: the tiers themselves, and the catalogue
 * that says what each facility is called and which section it belongs to. That
 * second call is what lets an admin add a limit and have it appear in the app
 * without a release — the screen renders whatever the catalogue describes
 * rather than a list baked in here.
 * **/
export default function usePremiumScreen() {
   const { user } = useAuth()
   const { data: plansData, isLoading, error } = usePlans()
   const { data: catalogData, isLoading: isCatalogLoading } = usePlanFeatureCatalog()

   const [selectedId, setSelectedId] = useState<string | null>(null)
   const [contactPlan, setContactPlan] = useState<Plan | null>(null)

   const plans = useMemo(
      () => [...(plansData?.results ?? [])].sort((a, b) => a.sort_order - b.sort_order),
      [plansData]
   )

   const sections = catalogData?.sections ?? []

   const currentPlanId = user?.active_plan ?? null

   /*
    * The default selection is the tier the admin marked as featured, falling
    * back to the cheapest paid one. Landing on Free would open the screen on
    * the one option that needs no decision.
    * **/
   const defaultPlan = useMemo(() => {
      const paid = plans.filter(p => p.plan_type !== "free")
      if (paid.length === 0) return plans[0] ?? null
      return paid.find(p => p.is_featured) ?? paid[0]
   }, [plans])

   const selectedPlan = plans.find(p => p.id === selectedId) ?? defaultPlan

   return {
      plans,
      sections,
      isLoading: isLoading || isCatalogLoading,
      error,
      selectedPlan,
      selectPlan: (plan: Plan) => setSelectedId(plan.id),
      isSelected: (plan: Plan) => selectedPlan?.id === plan.id,
      isCurrent: (plan: Plan) => !!currentPlanId && currentPlanId === plan.id,
      contactPlan,
      openContact: setContactPlan,
      closeContact: () => setContactPlan(null),
   }
}

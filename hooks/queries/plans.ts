import { useMutation, useQuery } from "@tanstack/react-query"
import {
   createSalesEnquiry,
   getPlanFeatureCatalog,
   getPlans,
   getSupportedCurrencies,
   type PlansResponse,
   type CurrenciesResponse,
   type PlanFeatureCatalog,
} from "@/services/plans.service"
import { useActiveCurrency } from "@/store/useLocaleStore"

export const usePlans = (enabled = true) => {
   const currency = useActiveCurrency()

   return useQuery<PlansResponse>({
      /*
       * Currency belongs in the key, not just the request: the same endpoint
       * returns genuinely different prices per currency, so caching them all
       * under one key would show the previous market's numbers for a beat
       * after switching.
       * **/
      queryKey: ["plans", currency],
      queryFn: () => getPlans(currency),
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
   })
}

export const useSupportedCurrencies = () =>
   useQuery<CurrenciesResponse>({
      queryKey: ["currencies"],
      queryFn: getSupportedCurrencies,
      /* This list changes on deploys, not on user actions. */
      staleTime: 24 * 60 * 60 * 1000,
   })

/*
 * The catalogue of what a plan can limit — labels, units and which section each
 * facility belongs to. Not keyed on currency: it describes the *shape* of a
 * plan, not its price.
 * **/
export const usePlanFeatureCatalog = (enabled = true) =>
   useQuery<PlanFeatureCatalog>({
      queryKey: ["plan-features"],
      queryFn: getPlanFeatureCatalog,
      enabled,
      /* Changes when an admin edits the catalogue, i.e. rarely. */
      staleTime: 60 * 60 * 1000,
   })

export const useCreateSalesEnquiry = () =>
   useMutation({
      mutationFn: createSalesEnquiry,
   })

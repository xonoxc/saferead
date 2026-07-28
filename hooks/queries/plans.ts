import { useQuery } from "@tanstack/react-query"
import {
   getPlans,
   getSupportedCurrencies,
   type PlansResponse,
   type CurrenciesResponse,
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

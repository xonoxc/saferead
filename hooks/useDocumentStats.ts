import { useState, useEffect } from "react"
import { getDocumentStats } from "@/services/api"
import { attempt } from "@/utils/attempt"
import { StatsResponse } from "@/types/api/documents.types"

export const useDocumentStats = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    const result = await attempt(getDocumentStats())

    if (result.ok) {
      setStats(result.data)
    } else {
      setError(result.error.message || "Failed to fetch stats")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}

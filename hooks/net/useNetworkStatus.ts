import { useEffect, useState } from "react"
import * as Network from "expo-network"

export default function useNetworkStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const subscription = Network.addNetworkStateListener(e => {
      setIsOffline(!e.isConnected)
    })

    return () => subscription.remove()
  }, [])

  return isOffline
}

import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Space } from "@/types"
import { attempt, attemptSync } from "@/utils/attempt"

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSpaces = async () => {
    setIsLoading(true)

    const storeRes = await attempt(AsyncStorage.getItem("spaces"))
    if (!storeRes.ok) {
      setError("Failed to load spaces")
      console.error("Load spaces error:", storeRes.error)
      setIsLoading(false)
      return
    }

    const stored = storeRes.data
    if (!stored) {
      const defaultSpaces = getDefaultSpaces()
      setSpaces(defaultSpaces)

      const saveAttemptResult = await attempt(saveSpaces(defaultSpaces))
      if (!saveAttemptResult.ok) {
        setError("Failed to save default spaces")
      }
      setIsLoading(false)
      return
    }

    const parsedSpaces = attemptSync(JSON.parse(stored))
    if (!parsedSpaces.ok) {
      setError("Failed to parse spaces")
      setIsLoading(false)
      return
    }

    setSpaces(parsedSpaces.data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadSpaces()
  }, [])

  const saveSpaces = async (spacesToSave: Space[]) => {
    const strfRes = attemptSync(JSON.stringify(spacesToSave))
    if (!strfRes.ok) {
      setError("Failed to stringify spaces")
      return
    }

    const stringifiedSpaces = strfRes.data

    const saveRes = await attempt(AsyncStorage.setItem("spaces", stringifiedSpaces))
    if (!saveRes.ok) {
      setError("Failed to save spaces")
      console.error("Save spaces error:", saveRes.error)
    }
  }

  const createSpace = async (name: string, description: string, color: string, icon: string) => {
    const newSpace: Space = {
      id: Date.now().toString(),
      name,
      description,
      documentCount: 0,
      color,
      icon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedSpaces = [...spaces, newSpace]
    setSpaces(updatedSpaces)

    const saveRes = await attempt(saveSpaces(updatedSpaces))
    if (!saveRes.ok) {
      setError("Failed to save new space")
      return
    }

    return newSpace
  }

  const updateSpace = async (spaceId: string, updates: Partial<Space>) => {
    const updatedSpaces = spaces.map(space =>
      space.id === spaceId ? { ...space, ...updates, updatedAt: new Date().toISOString() } : space
    )
    setSpaces(updatedSpaces)
    const saveAttemptResult = await attempt(saveSpaces(updatedSpaces))
    if (!saveAttemptResult.ok) {
      setError("Failed to update space")
      console.error("Update space error:", saveAttemptResult.error)
    }
  }

  const deleteSpace = async (spaceId: string) => {
    const updatedSpaces = spaces.filter(space => space.id !== spaceId)
    setSpaces(updatedSpaces)

    const res = await attempt(saveSpaces(updatedSpaces))
    if (!res.ok) {
      setError("Failed to delete space")
      console.error("Delete space error:", res.error)
    }
  }

  return {
    spaces,
    isLoading,
    error,
    createSpace,
    updateSpace,
    deleteSpace,
    clearError: () => setError(null),
  }
}

function getDefaultSpaces(): Space[] {
  return [
    {
      id: "1",
      name: "Personal",
      description: "Your personal documents and notes",
      documentCount: 0,
      color: "#4CAF50",
      icon: "folder",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Work",
      description: "Documents related to your work projects",
      documentCount: 0,
      color: "#2196F3",
      icon: "briefcase",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

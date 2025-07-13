import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Space } from "@/types"

export const useSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSpaces()
  }, [])

  const loadSpaces = async () => {
    try {
      setIsLoading(true)
      const stored = await AsyncStorage.getItem("spaces")
      if (stored) {
        setSpaces(JSON.parse(stored))
      } else {
        const defaultSpaces = getDefaultSpaces()
        setSpaces(defaultSpaces)
        await saveSpaces(defaultSpaces)
      }
    } catch (err) {
      setError("Failed to load spaces")
      console.error("Load spaces error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSpaces = async (spacesToSave: Space[]) => {
    try {
      await AsyncStorage.setItem("spaces", JSON.stringify(spacesToSave))
    } catch (err) {
      console.error("Save spaces error:", err)
    }
  }

  const createSpace = async (name: string, description: string, color: string, icon: string) => {
    try {
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
      await saveSpaces(updatedSpaces)
      return newSpace
    } catch (err) {
      setError("Failed to create space")
      console.error("Create space error:", err)
      throw err
    }
  }

  const updateSpace = async (spaceId: string, updates: Partial<Space>) => {
    try {
      const updatedSpaces = spaces.map(space =>
        space.id === spaceId ? { ...space, ...updates, updatedAt: new Date().toISOString() } : space
      )
      setSpaces(updatedSpaces)
      await saveSpaces(updatedSpaces)
    } catch (err) {
      setError("Failed to update space")
      console.error("Update space error:", err)
    }
  }

  const deleteSpace = async (spaceId: string) => {
    try {
      const updatedSpaces = spaces.filter(space => space.id !== spaceId)
      setSpaces(updatedSpaces)
      await saveSpaces(updatedSpaces)
    } catch (err) {
      setError("Failed to delete space")
      console.error("Delete space error:", err)
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

import { useState, useEffect } from "react"
import { Audio } from "expo-av"
import * as Speech from "expo-speech"
import { VoiceNote } from "@/types"

export const useVoice = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [permissionResponse, requestPermission] = Audio.usePermissions()

  useEffect(() => {
    setupAudio()
  }, [])

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
    } catch (error) {
      console.error("Failed to setup audio:", error)
    }
  }

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..")
        await requestPermission()
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(recording)
      setIsRecording(true)
    } catch (err) {
      console.error("Failed to start recording", err)
    }
  }

  const stopRecording = async () => {
    if (!recording) return null

    try {
      setIsRecording(false)
      await recording.stopAndUnloadAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })

      const uri = recording.getURI()
      setRecording(null)
      return uri
    } catch (error) {
      console.error("Failed to stop recording:", error)
      return null
    }
  }

  const playSound = async (uri: string) => {
    try {
      setIsPlaying(true)
      const { sound } = await Audio.Sound.createAsync({ uri })
      await sound.playAsync()

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false)
          sound.unloadAsync()
        }
      })
    } catch (error) {
      console.error("Failed to play sound:", error)
      setIsPlaying(false)
    }
  }

  const transcribeAudio = async (audioUri: string): Promise<string> => {
    // Mock transcription - in a real app, you'd use a service like Google Speech-to-Text
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          "This is a mock transcription of the voice note. In a real implementation, this would be the actual transcribed text from the audio."
        )
      }, 2000)
    })
  }

  const speakText = async (text: string) => {
    try {
      Speech.speak(text, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.8,
      })
    } catch (error) {
      console.error("Failed to speak text:", error)
    }
  }

  const saveVoiceNote = async (
    documentId: string,
    audioUri: string,
    transcription: string,
    duration: number
  ) => {
    const voiceNote: VoiceNote = {
      id: Date.now().toString(),
      documentId,
      audioUri,
      transcription,
      timestamp: Date.now(),
      duration,
    }

    setVoiceNotes(prev => [...prev, voiceNote])
    return voiceNote
  }

  return {
    isRecording,
    isPlaying,
    voiceNotes,
    startRecording,
    stopRecording,
    playSound,
    transcribeAudio,
    speakText,
    saveVoiceNote,
  }
}

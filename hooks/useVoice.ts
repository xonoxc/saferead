import { useState, useEffect } from "react"
import {
   useAudioRecorder,
   useAudioRecorderState,
   RecordingPresets,
   AudioModule,
   setAudioModeAsync,
   useAudioPlayer,
} from "expo-audio"
import * as Speech from "expo-speech"
import { attempt, attemptSync } from "@/utils/attempt"
import { useDrawerAlert } from "./alerts/useAlert"

import type { VoiceNote } from "@/types"

export const useVoice = () => {
   const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
   const recorderState = useAudioRecorderState(audioRecorder)
   const [isPlaying, setIsPlaying] = useState(false)
   const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
   const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "undetermined">(
      "undetermined"
   )

   const showBottomAlert = useDrawerAlert()

   const [playerUri, setPlayerUri] = useState<string | null>(null)
   const player = useAudioPlayer(playerUri ?? undefined)

   useEffect(() => {
      if (!permissionStatus || permissionStatus === "undetermined") {
         requestPermission()
      }
   }, [])

   const requestPermission = async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync()
      setPermissionStatus(status.granted ? "granted" : "denied")
   }

   const startRecording = async () => {
      if (recorderState.isRecording) return null

      if (permissionStatus !== "granted") {
         const reqStatus = await attempt(AudioModule.requestRecordingPermissionsAsync())
         if (!reqStatus.ok) {
            alert("Failed to request microphone permission. Please check your device settings.")
            return
         }

         const status = reqStatus.data
         if (!status.granted) {
            alert("Permission to access microphone is required to record audio.")
            setPermissionStatus("denied")
            return
         }
         setPermissionStatus("granted")
      }

      const audioModeSetAttempt = await attempt(
         setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
         })
      )
      if (!audioModeSetAttempt.ok) {
         console.error("Failed to set audio mode:", audioModeSetAttempt.error)
         return null
      }

      const prepRes = await attempt(audioRecorder.prepareToRecordAsync())
      if (!prepRes.ok) {
         console.error("Failed to prepare audio recorder:", prepRes.error)
         return null
      }

      const res = attemptSync(audioRecorder.record())
      if (!res.ok) {
         console.error("Failed to start recording:", res.error)
         return null
      }
   }

   const stopRecording = async () => {
      if (!recorderState.isRecording) return null

      const recordStopAtt = await attempt(audioRecorder.stop())
      if (!recordStopAtt.ok) {
         showBottomAlert({
            type: "error",
            title: "Recording Error",
            message: recordStopAtt.error.message || "Failed to stop recording.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
         return
      }

      return audioRecorder.uri
   }

   const playSound = async (uri: string) => {
      setPlayerUri(uri)
      setIsPlaying(true)
      player.play()
      setIsPlaying(false)
      player.seekTo(0)
   }

   /* const transcribeAudio = async (_audioUri: string): Promise<string> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          "This is a mock transcription of the voice note. In a real implementation, this would be the actual transcribed text from the audio."
        )
      }, 2000)
    })
  } */

   const speakText = async (text: string) => {
      const resp = attemptSync(
         Speech.speak(text, {
            language: "en-US",
            pitch: 1.0,
            rate: 0.8,
         })
      )
      if (!resp.ok) {
         showBottomAlert({
            type: "error",
            title: "Speech Error",
            message: resp.error.message || "Failed to speak the provided text.",
            actions: [{ text: "OK", style: "primary", onPress: () => {} }],
         })
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
      isRecording: recorderState.isRecording,
      isPlaying,
      voiceNotes,
      startRecording,
      stopRecording,
      playSound,
      speakText,
      saveVoiceNote,
      recorderState,
      player,
   }
}

import { useAuth } from "./useAuth"
import { useDrawerAlert } from "./alerts/useAlert"
import { useAnalysisStore } from "@/store/useAnalysisStore"
import { useAnalyzeAction } from "./useAnalyzeAction"
import { pickDocument } from "@/utils/docs/picker"
import {
   MAX_SCAN_PAGES,
   capturePage,
   pagesToDocument,
   pickPagesFromGallery,
   type ScanPage,
} from "@/utils/docs/scanner"

import type { AlertAction, AlertOptions } from "@/store/useAlertStore"

type ShowAlert = (options: AlertOptions) => void

export function useDocumentScan() {
   const { user } = useAuth()
   const showBottomAlert = useDrawerAlert()

   const { handleAnalyzeDocument } = useAnalyzeAction()

   const selectedDocumentType = useAnalysisStore(s => s.selectedDocumentType)

   const showError = (message: string) =>
      showBottomAlert({
         type: "error",
         title: "Error",
         message,
         actions: [{ text: "OK", style: "primary", onPress: () => {} }],
      })

   /*
    * One photo, then a prompt, until the user says the document is complete.
    *
    * A page count is not knowable up front — the point of scanning a contract
    * is that it is however long it is — so the loop asks after each shot
    * rather than making someone commit to a number first.
    * **/
   const capturePages = async () => {
      const pages: ScanPage[] = []

      while (pages.length < MAX_SCAN_PAGES) {
         const shot = await capturePage()

         if (!shot.ok) {
            /* Backing out of the camera keeps the pages already taken. */
            if (!shot.canceled) showError(shot.error.message)
            break
         }

         pages.push(shot.data)

         const more = await ask(showBottomAlert, {
            type: "info",
            title: `Page ${pages.length} added`,
            message:
               pages.length >= MAX_SCAN_PAGES
                  ? `That is the ${MAX_SCAN_PAGES}-page limit.`
                  : "Scan the next page, or analyze what you have.",
            choices:
               pages.length >= MAX_SCAN_PAGES
                  ? [{ value: "done", text: "Analyze", style: "primary" }]
                  : [
                       { value: "more", text: "Add page", style: "ghost" },
                       { value: "done", text: "Analyze", style: "primary" },
                    ],
         })

         if (more !== "more") break
      }

      return pages
   }

   const handleDocumentScan = async () => {
      if (!user) {
         showError("Please log in to scan documents")
         return
      }

      const source = await ask(showBottomAlert, {
         title: "Add a document",
         message: "Scan the pages with your camera, or pick something you already have.",
         choices: [
            { value: "camera", text: "Scan with camera", style: "primary" },
            { value: "gallery", text: "Choose images", style: "ghost" },
            { value: "files", text: "Browse files", style: "ghost" },
            { value: null, text: "Cancel", style: "ghost" },
         ],
      })

      if (!source) return

      if (source === "files") {
         const picked = await pickDocument()
         if (!picked.ok) {
            if (!picked.canceled) showError(picked.error?.message || "Failed to pick document")
            return
         }
         await handleAnalyzeDocument(picked.data, selectedDocumentType)
         return
      }

      let pages: ScanPage[] = []

      if (source === "camera") {
         pages = await capturePages()
      } else {
         const picked = await pickPagesFromGallery()
         if (!picked.ok) {
            if (!picked.canceled) showError(picked.error.message)
            return
         }
         pages = picked.data
      }

      if (pages.length === 0) return

      const document = await pagesToDocument(pages)
      if (!document.ok) {
         showError(document.error.message)
         return
      }

      await handleAnalyzeDocument(document.data, selectedDocumentType)
   }

   return {
      handleDocumentScan,
   }
}

/*
 * The drawer alert, awaited.
 *
 * A multi-page scan is a sequence — capture, ask, capture again — and driving
 * that through the alert's `onPress` callbacks would turn a loop into a chain
 * of continuations. The drawer has no dismiss-by-backdrop, so every path out
 * of it runs one of these actions and the promise always settles.
 * **/
function ask<T extends string>(
   showAlert: ShowAlert,
   options: {
      title: string
      message: string
      type?: AlertOptions["type"]
      choices: { value: T | null; text: string; style: AlertAction["style"] }[]
   }
): Promise<T | null> {
   return new Promise(resolve =>
      showAlert({
         type: options.type,
         title: options.title,
         message: options.message,
         actions: options.choices.map(choice => ({
            text: choice.text,
            style: choice.style,
            onPress: () => resolve(choice.value),
         })),
      })
   )
}

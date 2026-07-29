import * as ImagePicker from "expo-image-picker"
import { File, Paths } from "expo-file-system"
/*
 * `pdf-lib/cjs`, not `pdf-lib`.
 *
 * The package's `module` field points at an ESM build that does
 * `import tslib from "tslib"; const { __extends } = tslib`. Metro resolves
 * `module` first when bundling for web, where that interop hands back
 * `undefined` and the destructure throws *at import time* — which takes down
 * the whole app, not just the scanner, because this module is reachable from
 * the tab bar. Native already resolves `main` (the CJS build); naming it
 * explicitly just makes every platform agree.
 * **/
import { PDFDocument } from "pdf-lib/cjs"

import { attempt } from "@/utils/attempt"
import type { FileDocument } from "@/types/docs"

/*
 * Capturing a document that runs to more than one page.
 *
 * A scan is one file server-side, so N photos have to arrive as one file. They
 * are merged into a PDF here rather than uploaded one by one: the backend
 * already rasterises and OCRs scanned PDFs page by page, so this needs no
 * server change — and a contract split across three uploads would come back as
 * three unrelated analyses, which is worse than not supporting it at all.
 * **/

/* The server rasterises at most 20 pages of a scanned PDF (`_PDF_OCR_MAX_PAGES`). */
export const MAX_SCAN_PAGES = 20

/*
 * Pages are letterboxed onto A4 rather than sized to the photo.
 *
 * The server rasterises a scanned PDF at 2x its *point* size, so a page sized
 * to a 3024x4032 photo would be rasterised at 6048x8064 — slow, and big enough
 * to be worth avoiding for no gain. A4 at 2x is ~1190x1684, which is well
 * above what the OCR needs.
 * **/
const A4 = { width: 595.28, height: 841.89 }

export type ScanResult =
   | { ok: true; data: FileDocument }
   | { ok: false; canceled?: boolean; error: Error }

export type ScanPage = ImagePicker.ImagePickerAsset

/* One photo from the camera. Called in a loop for a multi-page scan. */
export async function capturePage(): Promise<
   { ok: true; data: ScanPage } | { ok: false; canceled?: boolean; error: Error }
> {
   const permission = await attempt(() => ImagePicker.requestCameraPermissionsAsync())
   if (!permission.ok || !permission.data.granted) {
      return fail("Camera access is off. Turn it on in Settings to scan a document.")
   }

   const result = await attempt(() =>
      ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.8 })
   )
   if (!result.ok) return fail("Failed to launch the camera. Please try again.")
   if (result.data.canceled) return { ok: false, canceled: true, error: new Error("Canceled") }

   const page = result.data.assets?.[0]
   if (!page) return fail("No image captured. Please try again.")

   return { ok: true, data: page }
}

/* Existing photos of a document, picked in one go. */
export async function pickPagesFromGallery(): Promise<
   { ok: true; data: ScanPage[] } | { ok: false; canceled?: boolean; error: Error }
> {
   const permission = await attempt(() => ImagePicker.requestMediaLibraryPermissionsAsync())
   if (!permission.ok || !permission.data.granted) {
      return fail("Photo access is off. Turn it on in Settings to upload images.")
   }

   const result = await attempt(() =>
      ImagePicker.launchImageLibraryAsync({
         mediaTypes: ["images"],
         allowsMultipleSelection: true,
         selectionLimit: MAX_SCAN_PAGES,
         quality: 0.8,
      })
   )
   if (!result.ok) return fail("Failed to open your photos. Please try again.")
   if (result.data.canceled) return { ok: false, canceled: true, error: new Error("Canceled") }

   const pages = result.data.assets ?? []
   if (pages.length === 0) return fail("No images selected. Please try again.")

   return { ok: true, data: pages }
}

/*
 * Turn captured pages into the single file the upload takes.
 *
 * One page stays a plain image — merging it into a PDF would only cost the
 * server a rasterise step to get back to the image it already had.
 * **/
export async function pagesToDocument(pages: ScanPage[]): Promise<ScanResult> {
   if (pages.length === 0) return fail("No pages to analyze.")

   const stamp = new Date().toLocaleDateString()

   if (pages.length === 1) {
      const page = pages[0]
      const mimeType = page.mimeType || "image/jpeg"
      return {
         ok: true,
         data: {
            uri: page.uri,
            type: mimeType,
            mimeType,
            /*
             * The server picks its reader off the *file extension*, so a name
             * it does not recognise (an iOS `.HEIC` left on an asset the
             * picker already transcoded, or no name at all) is read as no
             * text rather than as an error. Keep the picker's name only when
             * it ends in something the server reads.
             * **/
            name: /\.(jpe?g|png)$/i.test(page.fileName ?? "")
               ? page.fileName
               : `scan-${Date.now()}.${mimeType.includes("png") ? "png" : "jpg"}`,
            title: `Scanned Document ${stamp}`,
         },
      }
   }

   const merged = await attempt(() => buildPdf(pages.slice(0, MAX_SCAN_PAGES)))
   if (!merged.ok) {
      console.log("PDF merge error:", merged.error)
      return fail("Could not combine those pages. Try scanning them again.")
   }

   return {
      ok: true,
      data: {
         uri: merged.data,
         type: "application/pdf",
         mimeType: "application/pdf",
         name: `scan-${Date.now()}.pdf`,
         title: `Scanned Document ${stamp} (${pages.length} pages)`,
      },
   }
}

async function buildPdf(pages: ScanPage[]): Promise<string> {
   const pdf = await PDFDocument.create()

   for (const page of pages) {
      const bytes = await new File(page.uri).bytes()
      /*
       * Sniffed, not taken from `mimeType`: pdf-lib only reads JPEG and PNG,
       * and a picker can hand back a `.jpg` name over PNG bytes (or the other
       * way round) often enough that trusting the label throws deep inside the
       * embed with an unreadable message.
       * **/
      const image = isPng(bytes) ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes)

      const scale = Math.min(A4.width / image.width, A4.height / image.height)
      const width = image.width * scale
      const height = image.height * scale

      pdf.addPage([A4.width, A4.height]).drawImage(image, {
         x: (A4.width - width) / 2,
         y: (A4.height - height) / 2,
         width,
         height,
      })
   }

   const out = new File(Paths.cache, `scan-${Date.now()}.pdf`)
   out.create({ overwrite: true })
   out.write(await pdf.save())

   return out.uri
}

function isPng(bytes: Uint8Array) {
   return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
}

function fail(message: string) {
   return { ok: false as const, error: new Error(message) }
}

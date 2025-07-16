/*
 * Utility functions for handling file objects
 * **/
export function normalizeFile(
  file: any,
  fallbackName: string
): Blob | File | { uri: string; type: string; name: string } {
  if (file?.uri) {
    return {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.name || fallbackName,
    }
  }

  if (file instanceof File || file instanceof Blob) {
    return file
  }

  return new Blob([file], { type: "application/octet-stream" })
}

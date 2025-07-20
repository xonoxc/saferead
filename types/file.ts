export interface ReactNativeFile {
  uri: string
  type?: string
  mimeType?: string
  name?: string
}

export const isReactNativeFile = (file: any): file is ReactNativeFile =>
  typeof file?.uri === "string" && typeof file?.type === "string" && typeof file?.name === "string"

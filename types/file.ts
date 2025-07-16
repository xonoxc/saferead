export interface ReactNativeFile {
  uri: string
  type?: string
  name?: string
}

export const isReactNativeFile = (file: any): file is ReactNativeFile =>
  typeof file?.uri === "string"

import type { Dispatch, SetStateAction } from "react"

export type SetStateFunction<T> = Dispatch<SetStateAction<T>>

import type { Dispatch, SetStateAction } from "react"

export type SetStateFunction<T> = Dispatch<SetStateAction<T>>

export interface StateControlProps<T> {
   value: T
   onChange: SetStateFunction<T> | ((value: T) => void)
}

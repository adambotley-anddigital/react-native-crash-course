export type Nullable<T> = T | null | undefined

export interface ErrorResponse {
  error: string
}

export interface Note {
  $id: string
  text: string
  createdAt: string
}

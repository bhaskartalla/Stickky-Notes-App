declare module '@/fakeData' {
  export type NoteDataType = {
    $id: number
    body: string
    colors: string
    position: string
  }

  export const fakeData: NoteDataType[]
}

export type NoteDataTypePayload = {
  body?: string
  colors?: string
  position?: string
}

export type NoteDataType = Models.DefaultRow & {
  $id: string
  body: string
  colors: string
  position: string
}

export type MousePointerPosType = { x: number; y: number }

export type ColorType = {
  id: string
  colorHeader: string
  colorBody: string
  colorText: string
}

export type CollectionType = {
  name: string
  tableId: string
  dbId: string
}

export type RowListResponse = Models.RowList<Models.DefaultRow>

export type WrapperFunctionType = {
  listRows: () => Promise<RowListResponse>
  updateRow: () => Promise<RowListResponse>
}

export type DBType = Record<string, WrapperFunctionType>

export type CredentialsType = {
  email: string
  password: string
  confirmPassword?: string
}

export type UserDataType = {
  email: string
  displayName: string
  photoURL: string
  provider: 'email' | 'google'
}

export type ToastType = {
  message: string
  type?: 'success' | 'error'
}

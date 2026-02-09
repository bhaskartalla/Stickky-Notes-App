// types.d.ts (in project root)

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

export type NoteDataType = {
  $id: string
  body: string
  colors: string
  position: string
}

export type MousePointerPosType = { x: number; y: number }

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

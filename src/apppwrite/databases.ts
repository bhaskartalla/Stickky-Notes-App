import type { CollectionType, NoteDataTypePayload } from '@/types'
import { collections, tablesDB } from './config'
import type { Models } from 'appwrite'

type WrapperFunctionType = {
  listRows: () => Promise<Models.RowList<Models.DefaultRow>>
  updateRow: (
    rowId: string,
    payload: NoteDataTypePayload
  ) => Promise<Models.DefaultRow>
}
type DBType = Record<string, WrapperFunctionType>

const db: DBType = {}

collections.forEach((collection: CollectionType) => {
  db[collection.name] = {
    listRows: async () => {
      return await tablesDB.listRows({
        databaseId: collection.dbId,
        tableId: collection.tableId,
      })
    },
    updateRow: async (rowId: string, payload: NoteDataTypePayload) => {
      return await tablesDB.updateRow({
        databaseId: collection.dbId,
        tableId: collection.tableId,
        rowId,
        data: payload,
      })
    },
  }
})

export { db }

import type { FakeDataType } from '@/types'
import { fakeData } from '@/src/fakeData'
import NoteCard from '@/src/components/NoteCard'

const index = () => {
  // console.log('🚀 ~ fakeData:', fakeData)
  return (
    <div>
      {fakeData.map((note: FakeDataType) => (
        <NoteCard
          key={note.$id}
          note={note}
        />
      ))}
    </div>
  )
}

export default index

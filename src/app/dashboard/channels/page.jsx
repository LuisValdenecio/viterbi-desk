
import { getAllMyChannels } from '@/server-actions/channels'
import { ListItemTable } from './(components)/item-list/tableOfItems'

export const metadata = {
  title: 'Channels',
}

export default async function Page({ searchParams }) {

  const channels = await getAllMyChannels()
  return (
    <>
     <ListItemTable channels={channels} />
    </>
  )
}

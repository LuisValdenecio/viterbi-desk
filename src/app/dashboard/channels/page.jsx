
import { getAllChannels } from '@/server-actions/channels'
import { ListItemTable } from './(components)/item-list/tableOfItems'

export const metadata = {
  title: 'Channels',
}

export default async function Page({ searchParams }) {

  const channels = await getAllChannels()

  return (
    <>
     <ListItemTable channels={channels} />
    </>
  )
}

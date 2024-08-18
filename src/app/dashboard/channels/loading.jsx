import { Skeleton_ } from './(components)/skeletons'

export default function Loading({main_title, description}) {
    // You can add any UI inside Loading, including a Skeleton.
    return <Skeleton_ main_title={main_title} description={description} />
}
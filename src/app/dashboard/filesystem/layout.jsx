import { BreadCrumpComponent } from "@/components/breadcrump"

export default async function layout({ children }) {

    
    return <> 
        <BreadCrumpComponent description={'Manage your knowledge base, databases and much more'} />
        <div>
            {children}
        </div>
    </>
}
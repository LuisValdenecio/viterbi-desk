import { Loader2 } from "lucide-react"

export default function Loader_component() {
    return (
        <div className="flex justify-center items-center mt-12">
            <div>
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
        </div>
    )
}
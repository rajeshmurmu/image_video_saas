'use client'


import { Loader2 } from "lucide-react"


export default function LoadingScreen() {


    return (
        <div className="absolute w-full h-full flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin" size={50} />
                <p className="text-xl">Please note that this operation might take up to a couple of seconds.</p>
            </div>

        </div>
    )
}

'use client'

// import { Layer } from "@/features/layerSlice"
import { Layer } from "@/store/layerStore"
import Image from "next/image"



export default function LayerImage({ layer }: { layer: Layer }) {
    if (layer.url)
        return (
            <div className="w-full h-12 flex items-center gap-2  justify-center">
                <Image priority className="w-full object-contain h-full rounded-sm" alt={layer.name!} src={layer.format === 'mp4' ? layer.poster || layer.url : layer.url} sizes="fill" width={50} height={50} />
                <p>{`${layer.name?.slice(0, 10)}.${layer.format}`}</p>
            </div>
        )
}

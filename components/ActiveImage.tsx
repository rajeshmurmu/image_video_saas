import { Layer } from '@/features/layerSlice'
import Image from 'next/image'
import React from 'react'
import ImageCompareSlider from './layers/ImageCompareSlider'
import useLayerStore from '@/store/layerStore'

export default function ActiveImage() {

    const { generating, activeLayer, layers, comparedLayers, layerComparisonMode } = useLayerStore()


    if (!activeLayer?.url && comparedLayers.length === 0) return null



    if (layerComparisonMode && comparedLayers?.length > 0) {
        const comparisonLayers = comparedLayers.map((id) => layers.find((lyr) => lyr.id === id)).filter(Boolean) as Layer[]

        return <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
            <ImageCompareSlider layers={comparisonLayers} />
        </div>
    }

    return (
        <>
            {
                activeLayer.resourceType && (
                    <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
                        <div className='relative w-full h-full flex items-center justify-center'>
                            {activeLayer.resourceType === 'image' && (

                                <Image priority sizes="fill" className={`rounded-lg object-contain ${generating ? "animate-pulse" : ""}`} alt={activeLayer.name!} src={activeLayer.url!} fill={true} />
                            )}

                            {activeLayer.resourceType === 'video' && (
                                <video width={activeLayer.width} height={activeLayer.height} controls className={`rounded-lg object-contain max-w-full`} src={activeLayer.transcriptionURL || activeLayer.url} />
                            )}
                        </div>

                    </div>
                )
            }
        </>
    )

    // return (
    //     <div className="w-full relative h-svh p-24 bg-secondary flex flex-col items-center justify-center">
    //         <div className='relative w-full h-full flex items-center justify-center'>
    //             {activeLayer.resourceType === 'image' && (

    //                 <Image priority sizes="fill" className={`rounded-lg object-contain ${generating ? "animate-pulse" : ""}`} alt={activeLayer.name!} src={activeLayer.url!} fill={true} />
    //             )}

    //             {activeLayer.resourceType === 'video' && (
    //                 <video width={activeLayer.width} height={activeLayer.height} controls className={`rounded-lg object-contain max-w-full`} src={activeLayer.transcriptionURL || activeLayer.url} />
    //             )}
    //         </div>

    //     </div>
    // )
}

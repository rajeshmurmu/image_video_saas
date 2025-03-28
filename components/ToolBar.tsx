// import { RootState } from '@/store/store'
import React from 'react'
// import { useSelector } from 'react-redux'
import ImageToolBar from './toolbar/ImageToolBar'
import VideoToolBar from './toolbar/VideoToolBar'
import useLayerStore from '@/store/layerStore'
import ExportAsset from './toolbar/ExportAssets'

export default function ToolBar() {
    // const activeLayer = useSelector((state: RootState) => state.image.activeLayer)
    const { activeLayer } = useLayerStore()


    return (
        <div className='flex flex-col gap-y-2 w-full' >
            {activeLayer?.resourceType === 'image' ? (
                <ImageToolBar />
            ) : (
                <VideoToolBar />
            )}
            {activeLayer?.resourceType && (
                <ExportAsset resource={activeLayer.resourceType} />
            )}
        </div>
    )
}

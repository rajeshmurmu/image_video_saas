import useLayerStore from '@/store/layerStore'
import React from 'react'
import VideoTranscription from './video/VideoTranscription'
import SmartCrop from './video/SmartCrop'

export default function VideoToolBar() {
    const { activeLayer } = useLayerStore()
    if (activeLayer?.resourceType === "video")
        return (
            <>
                <VideoTranscription />
                <SmartCrop />
            </>
        )
}

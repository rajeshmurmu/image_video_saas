'use client'

import React from 'react'
import Layers from './layers/Layers'
import { ToggleThemeMode } from './ToggleThemeMode'
import ActiveImage from './ActiveImage'
import UploadForm from './upload/UploadForm'
import { Card, CardContent, CardHeader } from './ui/card'
import ToolBar from './ToolBar'
import LoadingScreen from './LoadingScreen'
import useLayerStore from '@/store/layerStore'

export default function Editor() {
    // const generating = useSelector((state: RootState) => state.image.generating)
    const { generating } = useLayerStore()
    return (
        <div className='flex h-full w-full'>
            <Card className='px-4 py-3 basis-[240px] shrink-0 rounded-none' >

                <CardHeader>
                    <div className="text-center">
                        <ToggleThemeMode />
                    </div>

                </CardHeader>

                <CardContent>
                    <div className='flex flex-col gap-4'>
                        {/* {activeLayer.resourceType === "image" ? <ToolBar /> : null} */}
                        <ToolBar />
                    </div>
                </CardContent>
            </Card>
            <UploadForm />
            {generating && (
                <LoadingScreen />
            )}
            <ActiveImage />
            <Layers />
        </div>
    )
}

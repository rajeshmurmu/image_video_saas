'use client'


import React, { useState } from 'react'
// import { RootState } from "@/store/store"
import UploadVideo from "./UploadVideo"
import UploadImage from "./UploadImage"
import useLayerStore from "@/store/layerStore"
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Card, CardContent } from '../ui/card'
import { Label } from '../ui/label'
import { ImageIcon, VideoIcon } from 'lucide-react'


export default function UploadForm() {
    // const dispatch = useDispatch()
    // const activeLayer = useSelector((state: RootState) => state.image.activeLayer)
    const { activeLayer } = useLayerStore()
    const [selectedType, setSelectedType] = useState("image")

    if (!activeLayer?.url) {
        return (
            <div className="w-full p-4 flex flex-col justify-center h-full">
                {selectedType === "image" ? (
                    <UploadImage />
                ) : (
                    <UploadVideo />)}


                <RadioGroup className='flex justify-center items-center gap-8 py-8' defaultValue='image' onValueChange={(e) => setSelectedType(e)}>

                    {/* for image */}
                    <Card className={`flex-col items-center justify-center py-4 px-6 gap-4 cursor-pointer ${selectedType === "image" ? "border-primary" : null}`}
                        onClick={() => setSelectedType("image")}
                    >
                        <CardContent className='flex items-center space-x-2 p-0'>
                            <RadioGroupItem value='image' id='image' hidden />
                            <Label className={`${selectedType === "image" ? "text-primary" : null}`}
                                htmlFor='image'
                            >
                                Image Mode
                            </Label>

                        </CardContent>
                        <ImageIcon className={`${selectedType === "image" ? "text-primary" : null}`} size={36} />
                    </Card>

                    {/* for video */}
                    <Card className={`flex-col items-center justify-center py-4 px-6 gap-4 cursor-pointer ${selectedType === "video" ? "border-primary" : null}`}
                        onClick={() => setSelectedType("video")}
                    >
                        <CardContent className='flex items-center space-x-2 p-0'>
                            <RadioGroupItem value='video' id='video' hidden />
                            <Label className={`${selectedType === "video" ? "text-primary" : null}`}
                                htmlFor='video'
                            >
                                Image Mode
                            </Label>

                        </CardContent>
                        <VideoIcon className={`${selectedType === "video" ? "text-primary" : null}`} size={36} />
                    </Card>
                </RadioGroup>
            </div>
        )
    }

}

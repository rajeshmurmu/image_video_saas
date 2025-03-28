import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import useLayerStore from '@/store/layerStore'
import { Crop, Instagram, Square, Youtube } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'


export default function SmartCrop() {
    const { setGenerating, activeLayer, addLayer, generating, setActiveLayer } = useLayerStore()
    const [height, setHeight] = useState("")
    const [width, setWidth] = useState("")
    const [aspectRatio, setAspectRatio] = useState("16:9")

    const handleGenCrop = async () => {
        try {
            setGenerating(true)
            const res = await apiClient.smartCrop({ videoUrl: activeLayer.url!, aspect: aspectRatio, height: activeLayer.height!.toString() ?? "" })

            if (res?.data.success) {
                setGenerating(false)
                const newLayerId = crypto.randomUUID()
                const thumbnailUrl = res.data.fillUrl?.replace(/\.[^/.]+$/, ".jpg")

                addLayer({
                    id: newLayerId,
                    name: "crop" + activeLayer.name,
                    format: activeLayer.format,
                    height: Number(height + activeLayer.height),
                    width: Number(width + activeLayer.width),
                    url: res.data.fillUrl,
                    public_id: activeLayer.public_id,
                    resourceType: "video",
                    poster: thumbnailUrl

                })

                setActiveLayer(newLayerId)
                toast.success(res.data?.message || "Video processed successfully.")

            }
        } catch (error) {
            console.log("Error smart crop", error)

        } finally {
            setGenerating(false)
        }
    }
    return (
        <Popover>
            <PopoverTrigger disabled={!activeLayer.url} asChild>
                <Button variant={"outline"} className='py-8 w-full'>
                    <span className='flex gap-1 items-center flex-col text-xs font-medium'>
                        Smart Crop
                        <Crop size={18} />
                    </span>

                </Button>

            </PopoverTrigger>

            <PopoverContent className='w-full'>
                <div className="flex flex-col h-full ">
                    <div className="space-y-2 pb-4">
                        <h3 className='font-medium text-center py-2 leading-none'>
                            Smart ReCrop
                        </h3>
                    </div>
                    <h4 className='text-md font-medium pb-2'>Format</h4>
                    <div className={`flex gap-4 items-center justify-center pb-2`}>
                        <Card className={`${aspectRatio === "16:9" ? "border-primary" : ""} p-4 w-36 cursor-pointer`}
                            onClick={() => setAspectRatio("16:9")}
                        >
                            <CardHeader className='text-center p-0'>
                                <CardTitle className='text-md'>Youtube</CardTitle>
                                <CardDescription>
                                    <p className='text-sm font-bold'>16:9</p>
                                </CardDescription>

                            </CardHeader>
                            <CardContent className='flex items-center justify-center p-0 pt-2'>
                                <Youtube />
                            </CardContent>

                        </Card>

                        <Card
                            className={cn(
                                aspectRatio === "9:16" ? " border-primary" : "",
                                "p-4 w-36 cursor-pointer"
                            )}
                            onClick={() => setAspectRatio("9:16")}
                        >
                            <CardHeader className="p-0 text-center">
                                <CardTitle className="text-md ">Instagram</CardTitle>
                                <CardDescription>
                                    <p className="text-sm font-bold ">9:16</p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center p-0 pt-2">
                                <Instagram />
                            </CardContent>
                        </Card>
                        <Card
                            className={cn(
                                aspectRatio === "1:1" ? " border-primary" : "",
                                "p-4 w-36 cursor-pointer"
                            )}
                            onClick={() => setAspectRatio("1:1")}
                        >
                            <CardHeader className="p-0 text-center">
                                <CardTitle className="text-md">Square</CardTitle>
                                <CardDescription>
                                    <p className="text-sm font-bold">1:1</p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center p-0 pt-2">
                                <Square className="w-10 h-10" />
                            </CardContent>
                        </Card>

                    </div>
                    <Button onClick={handleGenCrop}
                        className='w-full mt-4'
                        variant={"outline"}
                        disabled={!activeLayer.url || generating}
                    >
                        {generating ? "Cropping" : "Smart Crop"}
                    </Button>
                </div>

            </PopoverContent>
        </Popover>
    )
}

// import { RootState } from '@/store/store'
import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { ImageOffIcon } from 'lucide-react'

// import { addLayer, setActiveLayer, setGenerating } from '@/features/layerSlice'
import { apiClient } from '@/lib/api-client'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import useLayerStore from '@/store/layerStore'
import { toast } from 'sonner'

export default function BGReplace() {
    // const dispatch = useDispatch()
    // const generating = useSelector((state: RootState) => state.image.generating)
    // const activeLayer = useSelector((state: RootState) => state.image.activeLayer)
    const { addLayer, setActiveLayer, setGenerating, generating, activeLayer } = useLayerStore()
    const [prompt, setPrompt] = useState("")
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={generating} variant={"outline"} className='p-8'>
                    <span className='flex gap-1 items-center justify-center flex-col text-xs font-medium'>
                        BG Replace <ImageOffIcon size={20} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full'>
                <div>
                    <h3>Generative Background Replace</h3>
                    <p className='text-sm text-muted-foreground'>
                        Replace the background of an image with AI Generated content.
                    </p>
                </div>

                <div className='grid gap-2'>
                    <div className='mt-3'>
                        <Label className='py-2' htmlFor='prompt'>Prompt</Label>
                        <Input id='prompt' name='prompt' value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Describe the new background' />

                    </div>

                </div>

                <Button
                    disabled={!activeLayer?.url || generating}
                    onClick={async () => {
                        try {
                            const newLayerId = crypto.randomUUID()
                            setGenerating(true)
                            // const res = await BGRemoval({
                            //     format: activeLayer.format!,
                            //     activeImage: activeLayer.url!
                            // })

                            const res = await apiClient.bgReplace({
                                prompt,
                                imgUrl: activeLayer.url!
                            })
                            console.log(res)
                            // return
                            if (res?.data?.success) {
                                setGenerating(false)
                                addLayer({
                                    id: newLayerId,
                                    url: res?.data.bgReplace,
                                    format: "png",
                                    height: activeLayer.height,
                                    width: activeLayer.width,
                                    name: "bg_replace" + activeLayer.name,
                                    public_id: activeLayer.public_id,
                                    resourceType: "image"

                                })
                                setActiveLayer(newLayerId)
                                toast.success(res.data?.message || "Image processed successfully.")

                            }

                            if (res?.data?.error) {
                                setGenerating(false)
                            }
                        } catch (error) {
                            console.log(error)
                        } finally {
                            setGenerating(false)
                        }

                    }} className='w-full mt-4'>
                    {generating ? "Generating..." : "Replace Background"}

                </Button>
            </PopoverContent>
        </Popover>
    )
}

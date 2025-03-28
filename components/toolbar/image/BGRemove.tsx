import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { ImageIcon } from 'lucide-react'

import { apiClient } from '@/lib/api-client'
import useLayerStore from '@/store/layerStore'
import { toast } from 'sonner'

export default function BGRemove() {
    const { generating, activeLayer, addLayer, setActiveLayer, setGenerating } = useLayerStore()
    // const [activeTag, setActiveTag] = useState("")
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={generating} variant={"outline"} className='p-8'>
                    <span className='flex gap-1 items-center justify-center flex-col text-xs font-medium'>
                        BG Removal <ImageIcon size={20} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full'>
                <div>
                    <h3>Background Removal</h3>
                    <p className='text-sm text-muted-foreground'>
                        Remove the background of an image with one simple click.
                    </p>
                </div>

                <Button
                    disabled={!activeLayer?.url || generating}
                    onClick={async () => {
                        try {
                            const newLayerId = crypto.randomUUID()
                            setGenerating(true)
                            const res = await apiClient.bgRemove({
                                format: activeLayer.format!,
                                imgUrl: activeLayer.url!
                            })
                            console.log(res)
                            // return
                            if (res?.data?.success) {
                                setGenerating(false)
                                addLayer({
                                    id: newLayerId,
                                    url: res?.data.bgUrl,
                                    format: "png",
                                    height: activeLayer.height,
                                    width: activeLayer.width,
                                    name: "bg_removed" + activeLayer.name,
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
                    {generating ? "Removing..." : "Remove Background"}

                </Button>
            </PopoverContent>
        </Popover>
    )
}

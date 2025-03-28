import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { ArchiveRestore } from 'lucide-react'

import { apiClient } from '@/lib/api-client'
import useLayerStore from '@/store/layerStore'
import { toast } from 'sonner'

export default function GenRestore() {
    const { generating, activeLayer, addLayer, setActiveLayer, setGenerating } = useLayerStore()
    // const [activeTag, setActiveTag] = useState("")
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={generating} variant={"outline"} className='p-8'>
                    <span className='flex gap-1 items-center justify-center flex-col text-xs font-medium'>
                        Gen Restore <ArchiveRestore size={20} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full'>
                <div>
                    <h3>Generative restore</h3>
                    <p className='text-sm text-muted-foreground'>
                        Restore the image quality with one simple click.
                    </p>
                </div>

                <Button
                    disabled={!activeLayer?.url || generating}
                    onClick={async () => {
                        const newLayerId = crypto.randomUUID()
                        setGenerating(true)
                        // const res = await BGRemoval({
                        //     format: activeLayer.format!,
                        //     activeImage: activeLayer.url!
                        // })

                        const res = await apiClient.genRestore({
                            imgUrl: activeLayer.url!
                        })
                        console.log(res)
                        // return
                        if (res?.data?.success) {
                            setGenerating(false)
                            addLayer({
                                id: newLayerId,
                                url: res?.data.restoreUrl,
                                format: "png",
                                height: activeLayer.height,
                                width: activeLayer.width,
                                name: "restored_" + activeLayer.name,
                                public_id: activeLayer.public_id,
                                resourceType: "image"

                            })
                            setActiveLayer(newLayerId)
                            toast.success(res.data?.message || "Image processed successfully.")

                        }

                        if (res?.data?.error) {
                            setGenerating(false)
                        }

                    }} className='w-full mt-4'>
                    {generating ? "Restoring..." : "Restore"}

                </Button>
            </PopoverContent>
        </Popover>
    )
}

// import { RootState } from '@/store/store'
import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { Scissors } from 'lucide-react'

// import { addLayer, setActiveLayer, setGenerating } from '@/features/layerSlice'
import { apiClient } from '@/lib/api-client'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Checkbox } from '../../ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group'
import useLayerStore from '@/store/layerStore'
import { toast } from 'sonner'

export default function ExtractPart() {
    // const dispatch = useDispatch()
    // const generating = useSelector((state: RootState) => state.image.generating)
    // const activeLayer = useSelector((state: RootState) => state.image.activeLayer)
    const { activeLayer, generating, addLayer, setActiveLayer, setGenerating } = useLayerStore()
    const [prompts, setPrompts] = useState<string[]>([""])
    const [multiple, setMultiple] = useState<boolean>(false)
    const [mode, setMode] = useState<string>("default")
    const [invert, setInvert] = useState<boolean>(false)

    const addPrompt = () => {
        setPrompts([...prompts, ""])

    }

    const updatePrompt = (index: number, value: string) => {
        const newPrompts = [...prompts]
        newPrompts[index] = value
        setPrompts(newPrompts)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={generating} variant={"outline"} className='p-8'>
                    <span className='flex gap-1 items-center justify-center flex-col text-xs font-medium'>
                        AI Extract <Scissors size={20} />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full'>
                <div>
                    <h3>AI Extract</h3>
                    <p className='text-sm text-muted-foreground'>
                        Extract specific areas or objects from your image using AI.
                    </p>
                </div>

                <div className='grid gap-2'>
                    {prompts.map((prompt, index) => (
                        <div key={index} className='mt-3'>
                            <Label className='py-2' htmlFor={`prompt-${prompt}`}>Prompt {index + 1}</Label>
                            <Input id={`prompt-${prompt}`} value={prompt} onChange={(e) => updatePrompt(index, e.target.value)} placeholder='Describe what to extract.'
                                className='col-span-2 h-8'
                            />
                        </div>
                    ))}

                    <Button onClick={addPrompt} size={"sm"} >
                        Add prompt
                    </Button>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="multiple" checked={multiple} onCheckedChange={((checked) => setMultiple(checked as boolean))} />
                    </div>

                    <RadioGroup value={mode} onValueChange={setMode}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value='default' id="mode-default" />
                            <Label htmlFor='mode-default'>Default (transparent background)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value='mask' id="mode-mask" />
                            <Label htmlFor='mode-mask'>Mask</Label>
                        </div>


                    </RadioGroup>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="invert"
                            checked={invert}
                            onCheckedChange={(checked) => setInvert(checked as boolean)}
                        />
                        <Label htmlFor="invert">Invert (keep background)</Label>
                    </div>

                </div>

                <Button
                    disabled={!activeLayer?.url || generating}
                    onClick={async () => {
                        const newLayerId = crypto.randomUUID()
                        setGenerating(true)


                        try {
                            const res = await apiClient.extractPart({
                                prompts: prompts.filter((p) => p.trim() !== ""),
                                format: activeLayer.format!,
                                multiple,
                                mode: mode as 'default' || 'mask',
                                invert,
                                imgUrl: activeLayer.url!
                            })
                            // console.log(res)
                            // return
                            if (res?.data?.success) {
                                setGenerating(false)
                                addLayer({
                                    id: newLayerId,
                                    url: res?.data?.extractUrl,
                                    format: "png",
                                    height: activeLayer.height,
                                    width: activeLayer.width,
                                    name: "extracted" + activeLayer.name,
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
                            setGenerating(false)
                        } finally {
                            setGenerating(false)

                        }

                    }} className='w-full mt-4'>
                    {generating ? "Extracting..." : "Extract Image"}

                </Button>
            </PopoverContent>
        </Popover>
    )
}

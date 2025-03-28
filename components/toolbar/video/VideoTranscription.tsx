import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'
import useLayerStore from '@/store/layerStore'
import { Captions } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function VideoTranscription() {
    const { activeLayer, updateLayer, setGenerating, setActiveLayer } = useLayerStore()

    const [transcribing, setTranscribing] = useState(false)

    const handleTranscribe = async () => {
        if (!activeLayer.public_id || activeLayer.resourceType !== "video") {
            return
        }

        setTranscribing(true)
        setGenerating(true)

        try {
            const result = await apiClient.initiateTranscription({
                public_id: activeLayer.public_id,

            })



            if (result?.data?.subtitleVideoUrl) {
                console.log("res", result.data)
                updateLayer({ ...activeLayer, transcriptionURL: result.data.subtitleVideoUrl })
                setActiveLayer(activeLayer.id)
                toast.success(result.data?.message || "Video processed successfully.")

            }
        } catch (error) {
            console.log("video transcribing error", error)

        } finally {
            setTranscribing(false)
            setGenerating(false)
        }
    }
    return (
        <div className='flex items-center'>
            {!activeLayer.transcriptionURL && (
                <Button disabled={transcribing || activeLayer.resourceType !== "video"} onClick={handleTranscribe} className='py-8 w-full' variant={"outline"} >
                    {transcribing ? "Transcribing" : "Transcribe"}
                    <Captions size={18} />
                </Button>
            )}

            {activeLayer.transcriptionURL && (
                <Button className='py-8 w-full' variant={"outline"} asChild>
                    <a href={activeLayer.transcriptionURL} target='_blank' rel='noopener noreferrer'>
                        <span className='flex gap-1 items-center justify-center flex-col text-xs font-medium'>
                            View Transcription
                            <Captions size={18} />
                        </span>
                    </a>

                </Button>
            )}
        </div>
    )
}

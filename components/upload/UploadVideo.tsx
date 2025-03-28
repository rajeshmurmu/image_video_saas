
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import useLayerStore from '@/store/layerStore'
import videoAnimation from "@/public/animations/video-upload.json"
import Lottie from 'lottie-react'

export default function UploadVideo() {

    const { activeLayer, setActiveLayer, setGenerating, updateLayer } = useLayerStore()

    const onDrop = async (acceptedFiles: string | any[]) => {
        if (acceptedFiles.length) {
            const formData = new FormData()
            formData.append('video', acceptedFiles[0])

            // const objectUrl = URL.createObjectURL(acceptedFiles[0])
            setGenerating(true)


            setActiveLayer(activeLayer?.id)

            try {
                const res = await apiClient.uploadVideo(formData)
                console.log("res", res)
                if (res?.data?.result) {
                    const videoUrl = res.data.result.secure_url
                    const thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, ".jpg")
                    updateLayer({
                        id: activeLayer?.id,
                        url: res.data.result.secure_url,
                        // url: res.data.result.public_id,
                        width: res.data.result.width,
                        height: res.data.result.height,
                        name: res.data.result.original_filename,
                        public_id: res.data.result.public_id,
                        format: res.data.result.format,
                        poster: thumbnailUrl,
                        resourceType: res.data.result.resource_type,
                    })

                    setActiveLayer(activeLayer?.id)
                    setGenerating(false)
                    toast.success(res.data?.message || "File uploaded successfully.")

                }

                if (res?.data?.error) {
                    setGenerating(false)
                }

            } catch (error) {
                console.log(error)
            } finally {
                setGenerating(false)
            }

        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        accept: {
            "video/mp4": [".mp4", ".MP4"],
        },
        onDrop
    })

    if (!activeLayer?.url)
        return (
            <Card {...getRootProps()} className={`hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all ease-in-out ${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`}>
                <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24" >
                    <input type="text" {...getInputProps()} />
                    <div className="flex items-center flex-col justify-center gap-4">
                        <Lottie className='h-48' animationData={videoAnimation} />
                        <p className="text-muted-foreground text-2xl">{isDragActive ? "Drop video files here" : "Drag 'n' drop video files here, or click to select files"}</p>
                        <p className="text-muted-foreground">Supported formats: .mp4</p>
                    </div>
                </CardContent>

            </Card>
        )
}

"use client"

import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Download } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "../ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"
import useLayerStore from "@/store/layerStore"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

export default function ExportAsset({ resource }: { resource: string }) {
    const { activeLayer } = useLayerStore()
    const [selected, setSelected] = useState("original")
    const handleDownload = async () => {
        if (activeLayer?.public_id) {
            try {
                const res = await apiClient.downloadAssets({
                    public_id: activeLayer.public_id,
                    selected,
                    resource_type: resource,
                    format: "png",
                    url: activeLayer.url!,
                })

                if (!res?.data) {
                    throw new Error(res?.data)
                }

                // Fetch the image
                const imageResponse = await fetch(res.data.url)
                if (!imageResponse.ok) {
                    throw new Error("Failed to fetch image")
                }
                const imageBlob = await imageResponse.blob()

                // Create a download link and trigger the download
                const downloadUrl = URL.createObjectURL(imageBlob)
                const link = document.createElement("a")
                link.href = downloadUrl
                link.download = res.data.filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                // Clean up the object URL
                URL.revokeObjectURL(downloadUrl)
                toast.success(res.data?.message || "File downloaded successfully.")
            } catch (error) {
                console.error("Download failed:", error)
                // Here you could show an error message to the user
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger disabled={!activeLayer?.url} asChild>
                <Button variant="outline" className="py-8">
                    <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
                        Export
                        <Download size={18} />
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Export</DialogTitle>
                <div>
                    <h3 className="text-center text-2xl font-medium pb-4">Export</h3>
                    <div className="flex flex-col gap-4">
                        <Card
                            onClick={() => setSelected("original")}
                            className={cn(
                                selected === "original" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Original</CardTitle>
                                <CardDescription>
                                    {activeLayer.width}X{activeLayer.height}
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card
                            onClick={() => setSelected("large")}
                            className={cn(
                                selected === "large" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Large</CardTitle>
                                <CardDescription>
                                    {(activeLayer.width! * 0.7).toFixed(0)}X
                                    {(activeLayer.height! * 0.7).toFixed(0)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card
                            onClick={() => setSelected("medium")}
                            className={cn(
                                selected === "medium" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Medium</CardTitle>
                                <CardDescription>
                                    {(activeLayer.width! * 0.5).toFixed(0)}X
                                    {(activeLayer.height! * 0.5).toFixed(0)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                        <Card
                            className={cn(
                                selected === "small" ? "border-primary" : null,
                                "p-4 cursor-pointer"
                            )}
                            onClick={() => setSelected("small")}
                        >
                            <CardContent className="p-0">
                                <CardTitle className="text-md">Small</CardTitle>
                                <CardDescription>
                                    {(activeLayer.width! * 0.3).toFixed(0)}X
                                    {(activeLayer.height! * 0.3).toFixed(0)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Button onClick={handleDownload}>
                    Download {selected} {resource}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
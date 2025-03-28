'use client'

// import { Layer, removeLayer, setActiveLayer } from "@/features/layerSlice"
// import { RootState } from "@/store/store"
// import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/button"
import { EllipsisIcon, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import useLayerStore, { Layer } from "@/store/layerStore"

export default function LayerInfo({ layer, layerIndex }: { layer: Layer, layerIndex: number }) {
    // const layers = useSelector((state: RootState) => state.image.layers)
    // const dispatch = useDispatch()
    const { layers, removeLayer, setActiveLayer } = useLayerStore()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="absolute top-3 right-2 z-[100] ">
                    <Button className="" variant={"outline"}>
                        <EllipsisIcon size={14} />
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                {/* <DialogDescription> */}
                <div>
                    <h3 className="text-lg font-medium text-center mb-2">
                        Layer:{layer.id}
                    </h3>

                    <div className="py-4 space-y-0.5">
                        <p>
                            <span className="font-bold">Filename: {layer.name}</span>
                        </p>
                        <p>
                            <span className="font-bold">Format: {layer.format}</span>
                        </p>
                        <p>
                            <span className="font-bold">Size: {layer.width} X {layer.height}</span>
                        </p>
                    </div>
                </div>
                {/* </DialogDescription> */}
                <Button variant={"destructive"} className="flex items-center gap-2" onClick={(e) => {
                    e.stopPropagation()
                    setActiveLayer(layerIndex === 0 ? layers[1]?.id : layers[layerIndex - 1].id)
                    removeLayer(layer.id)
                }}>
                    <span>Delete Layer</span>
                    <Trash2 size={14} />
                </Button>
            </DialogContent>
        </Dialog>
    )
}

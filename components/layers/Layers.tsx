'use client'

// import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
// import { RootState } from "@/store/store";
import { ArrowRight, Images, Layers2 } from "lucide-react";
import { Button } from "../ui/button";
import LayerImage from "./LayerImage";
import LayerInfo from "./LayerInfo";
// import { addLayer, setActiveLayer, setComparedLayers, setLayerComparisonMode, toggleComparedLayer } from "@/features/layerSlice";
import { useMemo } from "react";
import Image from "next/image";
import useLayerStore from "@/store/layerStore";
export default function Layers() {
    const { layers, generating, activeLayer, layerComparisonMode, comparedLayers, addLayer, setActiveLayer, setComparedLayers, setLayerComparisonMode, toggleComparedLayer } = useLayerStore()
    // const dispatch = useDispatch()
    // const layers = useSelector((state: RootState) => state.image.layers)
    // const generating = useSelector((state: RootState) => state.image.generating)
    // // console.log(layers)
    // const activeLayer = useSelector((state: RootState) => state.image.activeLayer)
    // const layerComparisonMode = useSelector((state: RootState) => state.image.layerComparisonMode)
    // const comparedLayers = useSelector((state: RootState) => state.image.comparedLayers)



    const getLayerName = useMemo(() => (id: string) => {
        const layer = layers.find((lyr) => lyr.id === id)
        return layer ? layer.url : "Nothing here"
    }, [layers])


    const visibleLayers = useMemo(() => layerComparisonMode ? layers.filter((layer) => layer.url && layer.resourceType === "image") : layers, [layerComparisonMode, layers])

    return (
        <Card className=" h-full basis-[320px] shrink-0 scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl p-0 rounded-none">
            <CardHeader className="sticky top-0 z-[20] px-4 py-4 bg-card shadow-sm">

                {layerComparisonMode ? (
                    <div>
                        <CardTitle className="text-sm pb-2">Comparing...</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <Image priority alt="Compare" width={32} height={32} src={getLayerName(comparedLayers && comparedLayers[0] as string)!} />

                            {comparedLayers?.length > 0 && <ArrowRight />}
                            {comparedLayers?.length > 1 ? (
                                <Image priority alt="Compare" width={32} height={32} src={getLayerName(comparedLayers && comparedLayers[1] as string)!} />

                            ) : ("Nothing here")}


                        </CardDescription>
                    </div>
                ) : null}

                <div>
                    <CardTitle className="text-sm">Filename: {activeLayer?.name || 'Layers'}</CardTitle>
                </div>
                {activeLayer?.width && activeLayer?.height ? (
                    <CardDescription>
                        Size: {activeLayer?.width}X{activeLayer?.height}
                    </CardDescription>
                ) : null}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                {/* {layers.map((layer, idx) => ( */}
                {visibleLayers.map((layer, idx) => (
                    <div key={layer.id}
                        onClick={() => {
                            if (generating) return

                            if (layerComparisonMode) {
                                toggleComparedLayer(layer?.id)
                            } else {

                                setActiveLayer(layer?.id)
                            }
                        }}
                        className={`cursor-pointer ease-in-out hover:bg-secondary border px-2 ${generating ? "animate-pulse" : ""} ${layerComparisonMode ? (comparedLayers?.includes(layer?.id)) : (activeLayer?.id.toString() === layer.id.toString()) ? "border-primary" : ""}`}>
                        <div className="relative p-4 flex items-center">
                            <div className="flex gap-2 items-center h-8 w-full justify-between">
                                {!layer.url ? (
                                    <p className="text-xs font-medium justify-self-end">New Layer</p>
                                ) : null}
                                <div>
                                    <LayerImage layer={layer} />
                                </div>
                                {/* <LayerInfo layer={layer} layerIndex={layers.indexOf(layer)}/> */}
                                <div>
                                    <LayerInfo layer={layer} layerIndex={idx} />
                                </div>
                            </div>
                        </div>


                    </div>

                ))}
            </CardContent>
            <div className="flex sticky bottom-0 bg-black">
                <Button onClick={() => {
                    addLayer({
                        id: Date.now().toString(),
                        url: "",
                        height: 0,
                        width: 0,
                        public_id: "",
                        name: "",
                        format: ""
                    })
                }} className="w-1/2 flex gap-2 cursor-pointer rounded-none" variant={"outline"}>
                    <span>Create Layer</span>
                    <Layers2 size={18} className="text-xs text-secondary-foreground" />
                </Button>
                <Button onClick={() => {
                    if (layerComparisonMode) {
                        setLayerComparisonMode(layerComparisonMode ? false : true)
                    } else {
                        setComparedLayers([activeLayer.id])
                    }
                }} disabled={!activeLayer?.url || activeLayer?.resourceType === "video"}
                    className="w-1/2 flex gap-2 cursor-pointer rounded-none " variant={"outline"}
                >
                    {layerComparisonMode ? (
                        <span>
                            Stop Comparing
                        </span>
                    ) : (
                        <span>
                            Compare Layers
                        </span>
                    )}

                    {!layerComparisonMode && (
                        <Images className="text-secondary-foreground" size={14} />
                    )}
                </Button>
            </div>

        </Card>
    )
}

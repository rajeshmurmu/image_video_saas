"use client"

import { Layer } from "@/features/layerSlice"
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"

export default function ImageCompareSlider({ layers }: { layers: Layer[] }) {
    if (layers.length === 0) {
        return <div>No Layers selected from comparison</div>
    }
    if (layers.length === 1)
        return (
            <div className="h-full">
                <ReactCompareSliderImage src={layers[0].url || ""} srcSet={layers[0].url || ""} alt={layers[0].name || "Single Image"} className="rounded-lg object-contain" />
            </div>
        )

    return (
        <ReactCompareSlider
            itemOne={
                <ReactCompareSliderImage
                    src={layers[0].url || ""}
                    srcSet={layers[0].url || ""}
                    alt={layers[0].name || "Image one"}
                />}
            itemTwo={
                <ReactCompareSliderImage
                    src={layers[1].url || ""}
                    srcSet={layers[1].url || ""}
                    alt={layers[1].name || "Image two"}
                />}
        />
    )
}

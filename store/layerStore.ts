import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

export type Layer = {
  public_id?: string;
  width?: number;
  height?: number;
  url?: string;
  id: string;
  name?: string;
  format?: string;
  poster?: string;
  resourceType?: string;
  transcriptionURL?: string;
};

type LState = {
  generating: boolean;
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  activeLayer: Layer;
  updateLayer: (layer: Layer) => void;
  setPoster: (id: string, posterURL: string) => void;
  setTranscription: (id: string, transcriptionURL: string) => void;
  layerComparisonMode: boolean;
  setLayerComparisonMode: (mode: boolean) => void;
  comparedLayers: string[];
  setComparedLayers: (layers: string[]) => void;
  toggleComparedLayer: (id: string) => void;
  setGenerating: (generating: boolean) => void;
};

const useLayerStore = create<LState>()(
  devtools(
    persist(
      (set) => ({
        generating: false,
        layers: [],
        activeLayer: { id: "123" },
        layerComparisonMode: false,
        comparedLayers: [],
        addLayer: (layer: Layer) =>
          set((state) => ({
            layers: [...state.layers, layer],
          })),
        removeLayer: (id) =>
          set((state) => ({
            layers: state.layers.filter((layer) => layer.id !== id),
          })),
        // setActiveLayer: (id) =>
        //   set((state) => ({
        //     activeLayer: state.layers.find(
        //       (layer) => layer.id === id || state.layers[0]
        //     ),
        //   })),

        setActiveLayer: (id) =>
          set((state) => {
            // console.log(state.layers.find((layer) => layer.id === id));
            return {
              activeLayer:
                state.layers.find((layer) => layer.id === id) ||
                state.layers[0],
            };
          }),

        updateLayer: (layer) =>
          set((state) => {
            if (state.layers.length === 0)
              return {
                layers: [layer],
              };

            return {
              layers: state.layers.map((slayer) =>
                slayer.id === layer.id ? layer : slayer
              ),
            };
          }),

        setPoster: (id, posterUrl) =>
          set((state) => ({
            layers: state.layers.map((slayer) =>
              slayer.id === id ? { ...slayer, poster: posterUrl } : slayer
            ),
          })),

        setTranscription: (id, transcriptionUrl) =>
          set((state) => ({
            layers: state.layers.map((slayer) =>
              slayer.id === id
                ? { ...slayer, transcriptionURL: transcriptionUrl }
                : slayer
            ),
          })),

        setLayerComparisonMode: (mode) =>
          set(() => ({
            layerComparisonMode: mode,
          })),

        setComparedLayers: (layers: string[]) =>
          set(() => ({
            comparedLayers: layers,
            layerComparisonMode: layers.length > 0,
          })),

        toggleComparedLayer: (id) =>
          set((state) => {
            const newComparedLayers = state.comparedLayers.includes(id)
              ? state.comparedLayers.filter((layerId) => layerId !== id)
              : [...state.comparedLayers, id].slice(-2);

            return {
              comparedLayers: newComparedLayers,
              layerComparisonMode: newComparedLayers.length > 0,
            };
          }),

        setGenerating: (generatingMode) =>
          set(() => ({
            generating: generatingMode,
          })),
      }),
      { name: "layer-store" }
    )
  )
);

export default useLayerStore;

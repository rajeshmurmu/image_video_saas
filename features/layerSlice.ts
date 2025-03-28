import { createSlice } from "@reduxjs/toolkit";

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

// type State = {
//   layers: Layer[];
//   addLayer: (layer: Layer) => void;
//   removeLayer: (id: string) => void;
//   setActiveLayer: (id: string) => void;
//   activeLayer: Layer;
//   updateLayer: (layer: Layer) => void;
//   setPoster: (id: string, posterURL: string) => void;
//   setTranscription: (id: string, transcriptionURL: string) => void;
//   layerComparisonMode: boolean;
//   setLayerComparisonMode: (mode: boolean) => void;
//   comparedLayers: string[];
//   setComparedLayers: (layers: string[]) => void;
//   toggleComparedLayer: (id: string) => void;
// };

export type IState = {
  layers: Layer[];
  layerComparisonMode: boolean;
  activeLayer: Layer;
  comparedLayers: string[];
  generating: boolean;
};

const initialState: IState = {
  layers: [
    {
      id: "1",
    },
  ],
  layerComparisonMode: false,
  activeLayer: {
    id: "1",
    resourceType: "image",
  },
  comparedLayers: [],
  generating: false,
};

const layerSlice = createSlice({
  name: "layer-storage",
  initialState,
  reducers: {
    addLayer(state, action) {
      state.layers = [...state.layers, { ...action.payload }];
    },
    removeLayer(state, action) {
      state.layers = state.layers.filter(
        (layer) => layer.id !== action.payload.id
      );
    },

    setActiveLayer(state, action) {
      state.activeLayer =
        state.layers.find((layer) => layer.id === action.payload.id) ??
        state.layers[0];
    },

    updateLayer(state, action) {
      // console.log(action.payload);
      state.layers = state.layers.map((layer) =>
        layer.id === action.payload.id ? action.payload : layer
      );
    },

    setPoster(state, action) {
      state.layers = state.layers.map((layer) =>
        layer.id === action.payload.id
          ? { ...layer, poster: action.payload.poster }
          : layer
      );
    },

    setTranscription(state, action) {
      state.layers = state.layers.map((layer) =>
        layer.id === action.payload.id
          ? { ...layer, transcriptionURL: action.payload.transcriptionURL }
          : layer
      );
    },

    setLayerComparisonMode(state, action) {
      state.layerComparisonMode = action.payload.mode;
      state.comparedLayers = action.payload.mode ? [] : [];
    },

    setComparedLayers(state, action) {
      state.comparedLayers = action.payload.layers;
      state.layerComparisonMode = state.layers.length > 0;
    },

    toggleComparedLayer(state, action) {
      state.comparedLayers = state.comparedLayers.includes(action.payload.id)
        ? state.comparedLayers.filter(
            (layerId) => layerId !== action.payload.id
          )
        : [...state.comparedLayers, action.payload.id].slice(-2);
      state.layerComparisonMode = state.comparedLayers.length > 0;
    },
    setGenerating(state, action) {
      state.generating = action.payload;
    },
  },
});

export const {
  addLayer,
  removeLayer,
  setActiveLayer,
  setComparedLayers,
  setLayerComparisonMode,
  setPoster,
  setTranscription,
  toggleComparedLayer,
  updateLayer,
  setGenerating,
} = layerSlice.actions;

export default layerSlice.reducer;

// type FetchOptions = {
//   method?: "GET" | "POST" | "PUT" | "DELETE";
//   body?: object;
//   headers?: Record<string, string>;
// };
import axios from "axios";
import { toast } from "sonner";

// import { toast } from "sonner";

class ApiClient {
  private api = axios.create({
    baseURL: "http://localhost:3000/api/",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  async uploadImage(formData: FormData) {
    try {
      const response = await this.api.post(`/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error uploading image", error);
      toast.error("Error uploading image, try again.");
    }
  }

  async uploadVideo(formData: FormData) {
    try {
      const response = await this.api.post(`/upload-video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error uploading video", error);
      toast.error("Error uploading video, try again.");
    }
  }

  async genRemove({ prompt, imgUrl }: { prompt: string; imgUrl: string }) {
    try {
      const response = await this.api.post(`/gen-remove`, { prompt, imgUrl });

      // console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error gen remove image", error);
      toast.error("Error processing image, try again.");
    }
  }

  async bgRemove({ format, imgUrl }: { format: string; imgUrl: string }) {
    try {
      const response = await this.api.post(`/bg-remove`, {
        format,
        imgUrl,
      });

      console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error bg remove image", error);
      toast.error("Error processing image, try again.");
    }
  }

  async bgReplace({ prompt, imgUrl }: { prompt: string; imgUrl: string }) {
    try {
      const response = await this.api.post(`/bg-replace`, {
        prompt,
        imgUrl,
      });

      console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error bg replace image", error);
      toast.error("Error processing image, try again.");
    }
  }

  async genFill({
    imgUrl,
    aspect,
    width,
    height,
  }: {
    imgUrl: string;
    aspect: string;
    width: number;
    height: number;
  }) {
    // const prompt = `a ${aspect} ${width}x${height} ${imgUrl} image`;
    try {
      const response = await this.api.post(`/gen-fill`, {
        imgUrl,
        aspect,
        width,
        height,
      });

      console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error generative fill", error);
      toast.error("Error processing image, try again.");
    }
  }

  async extractPart({
    prompts,
    imgUrl,
    invert,
    mode,
    multiple,
    format,
  }: {
    imgUrl: string;
    prompts: string[];
    multiple?: boolean;
    mode: "default" | "mask";
    invert?: boolean;
    format: string;
  }) {
    // const prompt = `a ${aspect} ${width}x${height} ${imgUrl} image`;
    try {
      const response = await this.api.post(`/extract-part`, {
        imgUrl,
        prompts,
        multiple,
        mode,
        invert,
        format,
      });

      console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error extract image", error);
      toast.error("Error processing image, try again.");
    }
  }

  async genRestore({ imgUrl }: { imgUrl: string }) {
    try {
      const response = await this.api.post(`/gen-restore`, {
        imgUrl,
      });

      console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error generative restore image", error);
      toast.error("Error processing image, try again.");
    }
  }

  async enhance({ imgUrl }: { imgUrl: string }) {
    try {
      const response = await this.api.post(`/e-enhance`, {
        imgUrl,
      });

      console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error generative enhance", error);
      toast.error("Error processing image, try again.");
    }
  }

  // video api
  async initiateTranscription({ public_id }: { public_id: string }) {
    try {
      const response = await this.api.post(`/video-transcription`, {
        public_id,
      });

      // console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error video transcription", error);
      toast.error("Error processing video, try again.");
    }
  }

  async smartCrop({
    videoUrl,
    aspect,
    height,
  }: {
    videoUrl: string;
    aspect: string;
    height: string;
  }) {
    try {
      const response = await this.api.post(`/smart-crop`, {
        videoUrl,
        aspect,
        height,
      });

      // console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error video crop", error);
      toast.error("Error processing video, try again.");
    }
  }

  async downloadAssets({
    public_id,
    selected,
    resource_type,
    format,
    url,
  }: {
    public_id: string;
    selected: string;
    resource_type: string;
    format: string;
    url: string;
  }) {
    try {
      const response = await this.api.post(
        `/download?public_id=${public_id}&quality=${selected}&resource_type=${resource_type}&format=${format}&url=${url}`,
        {
          public_id,
        }
      );

      // console.log(response);
      if (response.data) {
        return response;
      }
    } catch (error) {
      console.log("Error download assets", error);
      toast.error("Error downloading assets, try again");
    }
  }
}

export const apiClient = new ApiClient();

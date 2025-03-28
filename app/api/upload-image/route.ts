import { NextRequest, NextResponse } from "next/server";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// interface CloudinaryUploadResult {
//   public_id: string;
//   [key: string]: unknown;
// }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "cloudinary_saas" },
        (error, result) => {
          if (error) {
            console.log("cloudinary upload error");
            reject(error);
          } else {
            // console.log("cloudinary upload result", result);
            resolve(result as UploadApiResponse);
          }
        }
      );
      uploadStream.end(buffer);
    });

    if (!response) {
      return NextResponse.json(
        { error: "Upload image failed" },
        { status: 500 }
      );
    }

    // const result = {
    //   ...response,
    //   secure_url: "/" + response.secure_url.split("/upload/")[1],
    // };
    return NextResponse.json(
      {
        result: response,
        // result,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Upload image failed", error);
    return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
  }
}

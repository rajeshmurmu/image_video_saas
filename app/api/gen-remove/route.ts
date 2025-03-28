import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function checkingImageProcessing(url: string) {
  try {
    const response = await fetch(url);
    if (response.ok) return true;
  } catch (error) {
    if (error) return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, imgUrl } = await request.json();

    const parts = imgUrl.split("/upload/");
    const removeUrl = `${parts[0]}/upload/e_gen_remove:prompt_${prompt}/${parts[1]}`;

    let isProcessed = false;
    const maxAttempts = 20;
    const delay = 1000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      isProcessed = (await checkingImageProcessing(removeUrl))!;

      if (isProcessed) {
        return NextResponse.json({ removeUrl, success: true }, { status: 200 });
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (!isProcessed) {
        // throw new Error("image processing time out");
        return NextResponse.json(
          { error: "gen remove image failed" },
          { status: 500 }
        );
      }
      console.log(removeUrl);

      return NextResponse.json({ removeUrl, success: true }, { status: 200 });
    }
  } catch (error) {
    console.log("Error gen remove", error);
    return NextResponse.json(
      { error: "gen remove image failed" },
      { status: 500 }
    );
  }
}

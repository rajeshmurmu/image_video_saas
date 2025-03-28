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
    const { imgUrl } = await request.json();
    const parts = imgUrl.split("/upload/");
    const restoreUrl = `${parts[0]}/upload/e_gen_restore/${parts[1]}`;
    // const restoreUrl = cloudinary.image(parts[1], { effect: "gen_restore" });

    let isProcessed = false;
    const maxAttempts = 20;
    const delay = 1000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      isProcessed = (await checkingImageProcessing(restoreUrl))!;

      if (isProcessed) {
        return NextResponse.json(
          { restoreUrl, success: true },
          { status: 200 }
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (!isProcessed) {
        // throw new Error("image processing time out");
        return NextResponse.json(
          { error: "gen restore failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ restoreUrl, success: true }, { status: 200 });
    }

    return NextResponse.json({ restoreUrl, success: true }, { status: 200 });
  } catch (error) {
    console.log("Error restore image", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to restore image",
      },
      { status: 500 }
    );
  }
}

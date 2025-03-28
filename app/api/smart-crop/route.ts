import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function checkImageProcessing(url: string) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("checking process error", error);
    return false;
  }
}
export async function POST(request: NextRequest) {
  try {
    const { videoUrl, aspect, height } = await request.json();

    const parts = videoUrl.split("/upload/");
    const fillUrl = `${parts[0]}/upload/ar_${aspect},c_fill,g_auto,h_${height}/${parts[1]}`;

    let isProcessed = false;
    const maxAttempts = 20;
    const delay = 1000; // 1 second
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = await checkImageProcessing(fillUrl);
      if (isProcessed) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (!isProcessed) {
      return NextResponse.json({ error: "gen crop failed" }, { status: 500 });
    }

    // for (let attempt = 0; attempt < maxAttempts; attempt++) {
    //   status = (await checkTranscriptionStatus(public_id))!;
    //   //   console.log(status);

    //   if (status === "complete") {
    //     const subtitleVideoUrl = generateSubtitledVideoUrl(public_id);
    //     return NextResponse.json(
    //       {
    //         subtitleVideoUrl,
    //         success: true,
    //         message: "Transcription completed",
    //       },
    //       { status: 200 }
    //     );
    //   } else if (status === "failed") {
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: "Transcription failed",
    //         subtitleVideoUrl: cldRes?.secure_url,
    //       },
    //       { status: 500 }
    //     );
    //   }
    //   await new Promise((resolve) => setTimeout(resolve, delay));
    // }
    return NextResponse.json(
      {
        fillUrl,
        success: true,
        message: "Gen crop successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error gen crop video", error);
    return NextResponse.json({ error: "gen crop failed" }, { status: 500 });
  }
}

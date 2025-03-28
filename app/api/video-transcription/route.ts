import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function generateSubtitledVideoUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: "video",
    transformation: [
      {
        overlay: {
          resource_type: "subtitles",
          public_id: `${publicId}.transcript`,
        },
      },
      { flags: "layer_apply" },
    ],
  });
}

async function checkTranscriptionStatus(publicId: string): Promise<string> {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: "video",
    });
    if (
      result.info &&
      result.info.raw_convert &&
      result.info.raw_convert.google_speech
    ) {
      return result.info.raw_convert.google_speech.status;
    }
    return "pending"; // Assume pending if we can't find status
  } catch (error) {
    console.error("Error checking transcription status:", error);
    throw new Error("Failed to check transcription status");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { public_id } = await request.json();
    console.log(public_id);

    const cldRes = await cloudinary.api.update(public_id, {
      resource_type: "video",
      raw_convert: "google_speech",
    });

    let status = "pending";
    const maxAttempts = 20;
    const delay = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      status = (await checkTranscriptionStatus(public_id))!;
      //   console.log(status);

      if (status === "complete") {
        const subtitleVideoUrl = generateSubtitledVideoUrl(public_id);
        return NextResponse.json(
          {
            subtitleVideoUrl,
            success: true,
            message: "Transcription completed",
          },
          { status: 200 }
        );
      } else if (status === "failed") {
        return NextResponse.json(
          {
            success: false,
            message: "Transcription failed",
            subtitleVideoUrl: cldRes?.secure_url,
          },
          { status: 500 }
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return NextResponse.json(
      {
        success: false,
        message: "Transcription time out",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error transcribe video", error);
    return NextResponse.json(
      { error: "gen remove image failed" },
      { status: 500 }
    );
  }
}

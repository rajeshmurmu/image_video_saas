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
    const searchParams = request.nextUrl.searchParams;
    const public_id = searchParams.get("public_id");
    const quality = searchParams.get("quality");
    // const resource = searchParams.get("resource");
    const format = searchParams.get("format");
    const activeUrl = searchParams.get("url");
    console.log("searchParams", searchParams);
    console.log(public_id, quality, format, activeUrl);

    if (!public_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing public_id parameter",
        },
        { status: 400 }
      );
    }

    let selected = "";

    if (format === "png") {
      selected = "";
    }

    if (format !== "png") {
      switch (quality) {
        case "original":
          break;
        case "large":
          selected = "q_80";
          break;
        case "medium":
          selected = "q_50";
          break;
        case "small":
          selected = "q_30";
          break;
        default:
          return NextResponse.json(
            { success: false, message: "Invalid quality" },
            { status: 400 }
          );
      }
    }

    //
    const parts = activeUrl?.split("/upload/") || [];
    const url = selected
      ? `${parts[0]}/upload/${selected}/${parts[1]}`
      : activeUrl;

    let isProcessed = false;
    const maxAttempts = 20;
    const delay = 1000; // 1 second
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = await checkImageProcessing(url!);
      if (isProcessed) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (!isProcessed) {
      return NextResponse.json({ error: "gen crop failed" }, { status: 500 });
    }

    return NextResponse.json(
      {
        url,
        filename: `${public_id}.${quality}.${format}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in download", error);
    return NextResponse.json({ error: "download failed" }, { status: 500 });
  }
}

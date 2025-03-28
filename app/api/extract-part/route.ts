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
  //   cloudinary.image("cloudinary_saas/sptt2jpoaowkdr7bayah", {effect: "background_removal"})
  try {
    const response = await fetch(url);
    if (response.ok) return true;
  } catch (error) {
    console.log("cloudinary fetch error", error);
    if (error) return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { format, imgUrl, prompts, invert, mode, multiple } =
      await request.json();

    // remove the other effect
    let url = imgUrl;
    if (imgUrl.includes("e_enhance")) {
      url = imgUrl.replace("/e_enhance", "");
    }

    if (imgUrl.includes("e_background_removal")) {
      url = imgUrl.replace("/e_background_removal", "");
    }

    if (imgUrl.includes("e_gen_remove")) {
      url = imgUrl.replace("/e_gen_remove", "");
    }

    if (imgUrl.includes("e_gen_restore")) {
      url = imgUrl.replace("/e_gen_restore", "");
    }

    if (imgUrl.includes("e_gen_background_replace")) {
      url = imgUrl.replace("/e_gen_background_replace", "");
    }

    const form = url.split(format);
    const pngConvert = form[0] + "jpg";
    const parts = pngConvert.split("/upload/");

    let extractParams = `prompt_(${prompts
      .map((p: string) => encodeURIComponent(p))
      .join(";")})`;

    if (multiple) extractParams += ";multiple_true";
    if (mode === "mask") extractParams += ";mode_mask";
    if (invert) extractParams += ";invert_true";
    const extractUrl = `${parts[0]}/upload/e_extract:${extractParams}/${parts[1]}`;

    // return NextResponse.json({ extractUrl, success: true }, { status: 200 });

    let isProcessed = false;
    const maxAttempts = 20;
    const delay = 1000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      isProcessed = (await checkingImageProcessing(extractUrl))!;

      if (isProcessed) {
        return NextResponse.json(
          { extractUrl, success: true },
          { status: 200 }
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (!isProcessed) {
        // throw new Error("image processing time out");
        return NextResponse.json(
          { error: "gen remove image failed" },
          { status: 500 }
        );
      }
      console.log(extractUrl);

      return NextResponse.json({ extractUrl, success: true }, { status: 200 });
    }

    return NextResponse.json({ extractUrl, success: true }, { status: 200 });
  } catch (error) {
    console.log("Error extract image", error);
    return NextResponse.json(
      { error: "extract image failed" },
      { status: 500 }
    );
  }
}

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
    const { format, imgUrl } = await request.json();

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
    // const removeUrl = `${parts[0]}/upload/e_gen_remove:prompt_${prompt}/${parts[1]}`;
    const bgUrl = `${parts[0]}/upload/e_background_removal/${parts[1]}`;
    console.log("bg-url", bgUrl);

    // return NextResponse.json(
    //   { bgUrl: bgUrl || cldImage, success: true },
    //   { status: 200 }
    // );

    let isProcessed = false;
    const maxAttempts = 20;
    const delay = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      isProcessed = (await checkingImageProcessing(bgUrl))!;

      if (isProcessed) {
        return NextResponse.json({ bgUrl, success: true }, { status: 200 });
      }

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (!isProcessed) {
        // throw new Error("image processing time out");
        return NextResponse.json(
          { error: "gen remove image failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ bgUrl, success: true }, { status: 200 });
    }
  } catch (error) {
    console.log("Error gen remove", error);
    return NextResponse.json(
      { error: "gen remove image failed" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { PdfReader } from "pdfreader";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Wrap pdfreader in a Promise
    const text = await new Promise((resolve, reject) => {
      let content = "";
      new PdfReader().parseBuffer(buffer, (err, item) => {
        if (err) {
          reject(err);
        } else if (!item) {
          // end of buffer
          resolve(content);
        } else if (item.text) {
          content += item.text + " ";
        }
      });
    });

    console.log("Extracted text:", text);

    return NextResponse.json({
      text,
    });
  } catch (error) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Failed to extract text", details: error.message },
      { status: 500 }
    );
  }
}

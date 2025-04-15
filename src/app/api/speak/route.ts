import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log("🔹 Received request to /api/speak");

    const body = await request.json();
    console.log("🔸 Request body:", body);

    const { text }: { text: string } = body;

    if (!text || typeof text !== "string") {
      console.log("❌ Invalid or missing 'text' in request");
      return NextResponse.json(
        { error: "Invalid input text" },
        { status: 400 }
      );
    }

    console.log("🎤 Sending request to Google TTS API");

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: "en-US",
            name: "en-US-Wavenet-D", // Optional: choose a voice
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorRes = await response.json();
      console.error("❗Google TTS API error:", errorRes);
      return NextResponse.json(
        { error: errorRes.error.message },
        { status: 500 }
      );
    }

    const data = await response.json();

    const audioContent = data.audioContent;
    const buffer = Buffer.from(audioContent, "base64");

    console.log("✅ Successfully received audio from Google TTS");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
      },
    });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    console.error("❗Server error:", error);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

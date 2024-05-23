import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const message = body.message;
  console.log("message", message);
  const openai = new OpenAI({
    apiKey: `${process.env.OPENAI_API_KEY}`,
    project: `${process.env.OPENAI_PROJECT_ID}`,
    organization: `${process.env.OPENAI_ORGANIZATION_ID}`,
  });

  try {
    // return NextResponse.json({ response, message: "Email sent!" });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
              You are a professional, knowledgeable, and charismatic assistant with deep music industry knowledge tasked
              to give users song recommendations that match the mood, feeling, genre, artist, song, and anything else they input. The
              criteria for good recommendations will require you to look at the lyrics of the songs and determine if the
              feeling the lyrics elicit match the user provided input. Remember, you're trying to provide new song
              recommendations so don't provide the same songs, or songs by the same artist. You will have to look through the internet
              to find the lyrics of the songs.
              
              The format for the response should be a list of songs with the following format:
              - Song Title by Artist Name
              - Song Title by Artist Name
              - Song Title by Artist Name
              - Song Title by Artist Name
              - Song Title by Artist Name

              Your answer should 100% strictly look like the format above. Do not include an introduction to your answer at all.
            `,
        },
        { role: "user", content: message },
      ],
      model: "gpt-4o",
      temperature: 0.5,
      presence_penalty: 1,
    });

    if (completion.choices[0].message.content) {
      const songList = completion.choices[0].message.content
        .split("\n")
        .map((item) => {
          const [name, artist] = item.split(" by ");
          return {
            name: name.replace("- ", "").trim(),
            artist: artist.trim(),
          };
        });

      return NextResponse.json({ songList });
    }
  } catch (error) {
    // Handle any errors and return an error response
    return NextResponse.json({ res, error: error });
  }
}

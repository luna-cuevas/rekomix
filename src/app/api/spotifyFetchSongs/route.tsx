import { NextResponse } from "next/server";

const getSpotifyAccessToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
};

const searchSongsOnSpotify = async (accessToken: any, query: any) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  console.log("data", data.tracks.items);
  return data.tracks.items.map((track: any) => ({
    name: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(", "),
    album: track.album.name,
    preview_url: track.preview_url,
    uri: track.uri,
    external_url: track.external_urls.spotify,
    image: track.album.images[0].url,
  }));
};

export async function POST(req: Request) {
  const body = await req.json();
  const songsList = body.songsList;

  try {
    const accessToken = await getSpotifyAccessToken();
    const searchResults = await Promise.all(
      songsList.map((song: any) =>
        searchSongsOnSpotify(accessToken, `${song.name} ${song.artist}`)
      )
    );

    return NextResponse.json({
      songs: searchResults.flat(),
      message: "Query processed successfully!",
    });
  } catch (error) {
    // Handle any errors and return an error response
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Failed to process the query." },
      { status: 500 }
    );
  }
}

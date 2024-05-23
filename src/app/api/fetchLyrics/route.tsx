import { NextResponse } from "next/server";
import fetch from "node-fetch";

const MUSIXMATCH_API_URL = "https://api.musixmatch.com/ws/1.1";

const getMusixmatchAccessToken = () => {
  return process.env.MUSIXMATCH_API_KEY;
};

const searchLyrics = async (trackName: string, artistName: string) => {
  const accessToken = getMusixmatchAccessToken();
  const query = `${trackName} ${artistName}`;
  console.log("query", encodeURIComponent(query));

  // Search for the track to get the track ID
  const searchResponse = await fetch(
    `${MUSIXMATCH_API_URL}/track.search?q_track=${encodeURIComponent(
      trackName
    )}&q_artist=${encodeURIComponent(artistName)}&apikey=${accessToken}`
  );
  const searchData = await searchResponse.json();
  console.log("search data", searchData);
  if (searchData.message.body.track_list.length === 0) return null;
  const trackId = searchData.message.body.track_list[0].track.track_id;

  // Get the lyrics using the track ID
  const lyricsResponse = await fetch(
    `${MUSIXMATCH_API_URL}/track.lyrics.get?track_id=${trackId}&apikey=${accessToken}`
  );
  const lyricsData = await lyricsResponse.json();
  console.log("lyrics data", lyricsData);
  if (!lyricsData.message.body.lyrics) return null;

  const lyrics = lyricsData.message.body.lyrics.lyrics_body;

  return lyrics || null;
};

export async function POST(req: Request) {
  const body = await req.json();
  console.log("body", body);
  const { name, artist } = body;

  if (!name || !artist) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  try {
    const lyrics = await searchLyrics(name, artist);
    console.log("lyrics", lyrics);
    if (!lyrics) {
      return NextResponse.json({ error: "Lyrics not found" });
    }

    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return NextResponse.json({ error: "Error" });
  }
}

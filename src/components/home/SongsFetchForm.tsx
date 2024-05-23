"use client";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Spinner } from "flowbite-react";

type Props = {};

const SongsFetchForm = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSongs = async (event: any) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setIsSearching(true);

    if (state.searchedSongs.length >= 25 && state.user == null) {
      toast.error("You have reached the limit of 25 songs");
      setIsSearching(false);
      return;
    }

    try {
      const openAiResponse = await fetch("api/openAIFetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: event.target[0].value,
        }),
      });
      const openAiResponseJSON = await openAiResponse.json();

      if (openAiResponseJSON.songList) {
        console.log("songs", openAiResponseJSON.songList);
        // make a post request to spotify api to get the songs
        const spotifyResponse = await fetch("api/spotifyFetchSongs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            songsList: openAiResponseJSON.songList,
          }),
        });
        const spotifyResponseJSON = await spotifyResponse.json();
        console.log("spotify response", spotifyResponseJSON);

        if (spotifyResponseJSON.songs.length > 0) {
          // Function to fetch lyrics for multiple songs

          // Function to fetch lyrics for a single song
          const fetchLyricsForSong = async (
            trackName: string,
            artistName: string
          ) => {
            const response = await fetch(`/api/fetchLyrics`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: trackName,
                artist: artistName,
              }),
            });
            const data = await response.json();
            return data.lyrics
              ? { trackName, artistName, lyrics: data.lyrics }
              : null;
          };

          const fetchLyricsForSongs = async (
            songs: { name: string; artist: string }[]
          ) => {
            const lyricsPromises = songs.map((song) =>
              fetchLyricsForSong(song.name, song.artist)
            );
            const lyricsResponses = await Promise.all(lyricsPromises);
            return lyricsResponses.filter((response) => response !== null);
          };

          const lyricsResponseJSON = await fetchLyricsForSongs(
            spotifyResponseJSON.songs
          );

          console.log("lyrics response", lyricsResponseJSON);

          // Map lyrics to songs
          const songsWithLyrics = spotifyResponseJSON.songs.map((song: any) => {
            const lyricsData = lyricsResponseJSON.find(
              (lyrics: any) =>
                lyrics.trackName === song.name &&
                lyrics.artistName === song.artist
            );
            return {
              ...song,
              lyrics: lyricsData ? lyricsData.lyrics : "Lyrics not found",
            };
          });

          setState((prev) => ({
            ...prev,
            searchedSongs:
              spotifyResponseJSON.songs.length < 25
                ? [...prev.searchedSongs, ...songsWithLyrics]
                : [...prev.searchedSongs],
          }));
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching the songs:", error);
    }
    setIsSearching(false);
  };

  return (
    <div className="h-fit justify-center flex flex-col">
      <h1 className="dark:text-white text-3xl mx-auto w-fit font-bold">
        RekoMix
      </h1>
      <p className="dark:text-white m-auto w-fit">
        AI-powered music recommendations
      </p>
      <form
        onSubmit={(event) => fetchSongs(event)}
        className="flex w-full gap-4 m-auto justify-center my-2">
        <input
          type="text"
          placeholder="Search for a song, mood, or genre"
          className=" w-full rounded-xl dark:bg-gray-800 dark:text-white"
        />
        <Button type="submit" className="!bg-blue-800 text-white ">
          {isSearching ? (
            <>
              <Spinner
                className="dark:text-white"
                color={"purple"}
                aria-label="Spinner button example"
                size="sm"
              />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SongsFetchForm;

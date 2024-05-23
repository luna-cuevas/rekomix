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

    if (
      state.searchedSongs.length >= 25 &&
      state.user.email !== "s.cuevas14+5@gmail.com"
    ) {
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

        setState((prev) => ({
          ...prev,
          searchedSongs:
            spotifyResponseJSON.songs.length < 25
              ? [...prev.searchedSongs, ...spotifyResponseJSON.songs]
              : [...prev.searchedSongs],
        }));
      }
    } catch (error) {
      console.error("An error occurred while fetching the songs:", error);
    }
    setIsSearching(false);
  };

  return (
    <div className="h-fit">
      <h1 className="text-white">RekoMix</h1>
      <p className="text-white">AI-powered music recommendations</p>
      <form
        onSubmit={(event) => fetchSongs(event)}
        className="flex gap-4 m-auto justify-center">
        <input
          type="text"
          placeholder="Search for a song"
          className=" w-full rounded-xl bg-gray-800 text-white"
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

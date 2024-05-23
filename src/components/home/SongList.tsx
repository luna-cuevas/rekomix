"use client";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

type Props = {};

const SongList = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (state.searchedSongs.length > 0) {
      setIsLoaded(true);
    }
  }, [state.searchedSongs]);

  return (
    <div className="flex flex-col justify-center w-full overflow-y-scroll h-auto my-2  ">
      {isLoaded &&
        state.searchedSongs.map((song: any, index: number) => {
          return (
            <div
              key={index}
              className="bg-white flex gap-4 dark:bg-gray-800 py-2 h-full shadow-lg rounded-lg w-full  px-4 border-b-2 border-white">
              <img
                src={song.image}
                alt=""
                className="rounded-t-lg max-w-[50px] h-auto"
              />
              <div className=" w-full  m-auto flex flex-col justify-center">
                <h2 className="text-xl w-fit font-semibold dark:text-white">
                  {song.name}
                </h2>
                <p className="text-sm w-fit font-light dark:text-gray-200">
                  {song.name}
                </p>
                {/* <p className="text-sm font-light dark:text-gray-200">
                    {song.name}
                  </p> */}
              </div>
              <div className="w-fit flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      showMusicPlayer: true,
                      currentSong: index,
                    }));
                  }}
                  className="bg-white p-2 rounded-lg dark:bg-gray-800">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SongList;

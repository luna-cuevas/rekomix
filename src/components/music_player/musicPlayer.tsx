"use client";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerAudioListProps,
  ReactJkMusicPlayerProps,
} from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

const MusicPlayer: React.FC = () => {
  const [state, setState] = useAtom(globalStateAtom);
  const [currentLyric, setCurrentLyric] = useState<string>("");
  const [playerKey, setPlayerKey] = useState<number>(0); // Key to force re-initialization

  const transformedSongsList = state.searchedSongs.map((song: any) => {
    return {
      name: song.name,
      singer: song.artist,
      cover: song.image,
      musicSrc: song.preview_url,
      lyric: song.lyrics,
    };
  }) as ReactJkMusicPlayerAudioListProps[];
  console.log("transformedSongsList", transformedSongsList);

  // useEffect(() => {
  //   if (state.searchedSongs.length > 0 && state.currentSong >= 0) {
  //     const currentSong = state.searchedSongs[state.currentSong];
  //     setCurrentLyric(currentSong.lyrics || "No lyrics available");
  //   }
  // }, [state.currentSong, state.searchedSongs]);

  const options: ReactJkMusicPlayerProps = {
    audioLists: transformedSongsList,
    playIndex: state.currentSong,
    theme: "dark",
    bounds: "body",
    mode: "full", // 'mini' or 'full'
    autoPlay: false,
    remember: true,
    showMiniModeCover: true,
    showDownload: false,
    showMediaSession: true,
    showPlay: true,
    showReload: true,
    showPlayMode: true,
    showThemeSwitch: true,
    showLyric: true,
    lyricClassName: "lyric",
    spaceBar: true,
    showDestroy: false,
    loadAudioErrorPlayNext: true,
    responsive: true,
    extendsContent: null,
    onAudioPlay: (audioInfo) => {
      console.log("audio playing", audioInfo);
    },
    onAudioPause: (audioInfo) => {
      console.log("audio paused", audioInfo);
    },
    onAudioEnded: (audioInfo) => {
      console.log("audio ended", audioInfo);
    },
    onAudioListsChange: (currentPlayId, audioLists, audioInfo) => {
      console.log("audio list changed", currentPlayId, audioLists, audioInfo);
    },
    onThemeChange: (theme) => {
      console.log("theme change:", theme);
    },
    // onDestroyed: async (currentPlayId, audioLists, audioInfo) => {
    //   console.log("player destroyed");
    //   setPlayerKey((prevKey) => prevKey + 1); // Increment key to force re-initialization
    // },
  };

  return (
    <div>
      {/* <div className="lyrics-container">
        <h2>Lyrics</h2>
        <pre>{currentLyric}</pre>
      </div> */}
      {state.searchedSongs.length > 0 && (
        <ReactJkMusicPlayer key={playerKey} {...options} />
      )}
    </div>
  );
};

export default MusicPlayer;

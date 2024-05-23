"use client";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import React from "react";
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerAudioListProps,
  ReactJkMusicPlayerProps,
} from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

const MusicPlayer: React.FC = () => {
  const [state, setState] = useAtom(globalStateAtom);
  const transformedSongsList = state.searchedSongs.map((song: any) => {
    return {
      name: song.name,
      singer: song.artist,
      cover: song.image,
      musicSrc: song.preview_url,
    };
  }) as ReactJkMusicPlayerAudioListProps[];

  const options: ReactJkMusicPlayerProps = {
    audioLists: transformedSongsList,
    playIndex: state.currentSong,
    theme: "dark",
    bounds: "body",
    mode: "full", // 'mini' or 'full'
    autoPlay: true,
    remember: true,
    showMiniModeCover: true,
    showDownload: false,
    showPlay: true,
    showReload: true,
    showPlayMode: true,
    showThemeSwitch: true,
    showLyric: false,
    showDestroy: true,
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
  };

  return state.searchedSongs.length > 0 && <ReactJkMusicPlayer {...options} />;
};

export default MusicPlayer;

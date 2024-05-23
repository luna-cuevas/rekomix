import { atom } from "jotai";

type State = {
  session: null | object;
  user: null | object;
  showMobileMenu: boolean;
  searchedSongs: any[];
  showMusicPlayer: boolean;
  currentSong: any;
};

// A helper function to work with localStorage and JSON serialization for the entire application state
const atomWithLocalStorage = (key: string, initialValue: any) => {
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (item !== null) {
        try {
          return JSON.parse(item);
        } catch {
          console.error("Could not parse the stored value in localStorage.");
        }
      } else {
        // If no item is found in localStorage, set the initial value
        localStorage.setItem(key, JSON.stringify(initialValue));
      }
    }
    return initialValue;
  };

  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: ((prevState: State) => State) | State) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );

  return derivedAtom;
};

// Define your initial state
const initialState: State = {
  session: null,
  user: null,
  showMobileMenu: false,
  searchedSongs: [],
  showMusicPlayer: false,
  currentSong: null,
};

// Create an atom with local storage persistence for the entire application state
export const globalStateAtom = atomWithLocalStorage(
  "RekoMixGlobalState",
  initialState
);

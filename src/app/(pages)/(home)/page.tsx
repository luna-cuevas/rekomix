import SongList from "@/components/home/SongList";
import SongsFetchForm from "@/components/home/SongsFetchForm";

export default function Home() {
  return (
    <main className="">
      {/* 
        Hero Section displaying an input to search songs on Spotify
        On the right side, there will be an image or video asset
      */}
      <div className="h-[calc(100vh-60px)] bg-black flex">
        <div className="h-1/2 flex w-1/2 m-auto max-w-[500px]">
          <div className="m-auto w-full h-full flex-col flex">
            <SongsFetchForm />
            <div className="overflow-y-scroll flex-1 my-2">
              <SongList />
            </div>

            {/* List of songs  */}
          </div>
        </div>
        <div className="w-1/2 h-1/2 m-auto"></div>
      </div>
    </main>
  );
}

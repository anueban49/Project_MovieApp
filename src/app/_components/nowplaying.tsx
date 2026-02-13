import { LoaderCircleIcon, Play, Star } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { VideoPlayer } from "./VideoPlayer";
export type VideoTypes = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
};
export type NowPlayingType = {
  adult?: boolean;
  backdrop_path: string;
  genre_ids?: number[];
  id?: string;
  original_language?: string;
  original_title?: string;
  overview: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  title: string;
  video?: boolean;
  vote_average: any;
  vote_count: number;
};
// {children}: {children: ReactNode} --> takes children from react as well as tsx type
export const NowPlaying = () => {
  const [nowplaying, setNowplaying] = useState<NowPlayingType[]>([]);
  const [video, setVideo] = useState<VideoTypes | null>(null);
  const [activeTrailer, setActiveTrailer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchNowPlaying = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/movie/now_playing?language=en-US&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );
        const data = await res.json();
        setNowplaying(data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNowPlaying();
  }, []);

  const fetchVideo = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.TMDB_BASE_URL}/movie/${id}/videos?language=en-US`,

        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      );
      const vid = await res.json();
      setVideo(vid.results[0]);
      setLoading(false);
      console.log("vidRes", vid.results[0]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Carousel className="w-full aspect-12/5 overflow-x-scroll scrollbar-hide relative p-0 m-0 pl-0">
      <CarouselContent className="flex scrollbar-none">
        {loading ? (
          <>
            <Skeleton className="w-full aspect-12/5 flex items-center justify-center bg-gray-400">
              <LoaderCircleIcon
                className="animate-spin scale-150 "
                color="white"
              />
            </Skeleton>
          </>
        ) : (
          <>
            {nowplaying.map((el) => {
              return (
                <CarouselItem
                  key={el.id}
                  className="w-full aspect-12/5 bg-cover bg-center bg-no-repeat overflow-hidden "
                  style={{
                    backgroundImage: `url(${process.env.TMDB_IMAGE_SERVICE_URL}/original${el.backdrop_path})`,
                  }}
                >
                  <div className="banner w-1/2 flex flex-col align-center justify-center gap-5">
                    <p className="promoTitle text-white">Now Playing:</p>
                    <h1 className="bannerTitle text-white font-bold">
                      {el.title}
                    </h1>
                    <h2 style={{ color: "white" }}>
                      {el.popularity?.toFixed(0) + " votes"}
                    </h2>
                    <p style={{ color: "white", display: "flex", gap: "5px" }}>
                      <Star style={{ color: "yellow", fill: "yellow" }} />
                      {el.vote_average.toFixed(1)}/10
                    </p>
                    <p style={{ color: "white" }}>{el.overview}</p>
                    <Dialog>
                      <DialogTrigger>
                        {" "}
                        <Button
                          onClick={() => {
                            const movieId = el.id as string;
                            if (movieId === el.id) {
                              fetchVideo(el.id as string);
                            }
                          }}
                          variant="outline"
                          className="w-[10em] scale-125"
                        >
                          <Play />
                          Play Trailer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-1/2 aspect-video">
                        <DialogDescription className="text-black">{video?.name}</DialogDescription>
                        <VideoPlayer title={video?.name as string} videoKey={video?.key as string} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CarouselItem>
              );
            })}
          </>
        )}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 left-3" />
      <CarouselNext className="absolute top-1/2 right-3" />
    </Carousel>
  );
};

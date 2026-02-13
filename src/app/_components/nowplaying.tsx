import { Star } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
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
  id?: number;
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
  const [video, setVideo] = useState<VideoTypes[]>([]);
  const [activeTrailer, setActiveTrailer] = useState<string | null>(null);
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/movie/now_playing?language=en-US&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          }
        );
        const data = await res.json();
        setNowplaying(data.results);
        // console.log(data.results)
      } catch (error) {
        console.log(error);
      }
    };
    fetchNowPlaying();
  }, []);
  //movieId=true => fetch video api through there => write a function that fetches the video by [movieId] =key
  //prepare the iframe appear<=>disappear mode
  const fetchVideos = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.TMDB_BASE_URL}/movie/${id}/videos?language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );
      const vid = await res.json();
      setVideo(vid.results);
      console.log(vid.results);
      // const trailer = vid.results.find((v: VideoTypes) => v.site === "YouTube");
      // if (trailer) setActiveTrailer(trailer.key);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Carousel
      className="w-full aspect-12/5 overflow-x-scroll scrollbar-hide relative p-0 m-0 pl-0"
      style={{
        width: "full",
        aspectRatio: "12/5",
        scrollbarWidth: "none",
        padding: "0px",
        zIndex: "0",
        position: "relative",
      }}
    >
      <CarouselContent className="flex" style={{ scrollbarWidth: "none" }}>
        {nowplaying.map((el, i) => {
          return (
            <CarouselItem
              key={i}
              className="w-screen aspect-12/5 bg-cover bg-center bg-no-repeat overflow-hidden "
              style={{
                backgroundImage: `url(${process.env.TMDB_IMAGE_SERVICE_URL}/original${el.backdrop_path})`,
                padding: "10rem",
              }}
            >
              <div className="w-1/2 flex flex-col align-center gap-5">
                <p style={{ color: "white", fontSize: "100%" }}>Now Playing:</p>
                <h1
                  style={{
                    color: "white",
                    fontSize: "4em",
                    fontWeight: "700",
                  }}
                >
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
                <Button
                  onClick={() => {
                    fetchVideos(el.id);
                  }}
                  variant="outline"
                  className="w-[10em] scale-125"
                >
                  Play Trailer
                </Button>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 left-3" />
      <CarouselNext className="absolute top-1/2 right-3" />
    </Carousel>
  );
};

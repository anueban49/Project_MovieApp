"use client";
import { useState, useEffect, ReactNode, use } from "react";
import Reactplayer from "react-player";
import { BaseStructure } from "@/app/_components/BaseStructure";
import { MovieTypes } from "@/app/_components/movietypes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
export type DataTypes = {
  adult?: boolean;
  backdrop_path?: string;
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
export type VideoTypes = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
};

export type VideoResponse = {
  id?: number;
  results: VideoTypes[];
};

interface Details {
  params: Promise<{
    movieId: string;
  }>;
}
type Genre = {
  name: string;
  id: number;
};

const API_BASE = `${process.env.TMDB_BASE_URL}`;
const AUTH_HEADERS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
};
const fetchJSON = async (url: any) => {
  return fetch(url, AUTH_HEADERS).then((res) => res.json());
};
const Moviedetails = ({ params }: Details) => {
  const { movieId } = use(params);
  const [details, setDetails] = useState<DataTypes>();
  const [videos, setVideos] = useState<VideoTypes[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const [detailsRes, videoRes] = await Promise.all([
          fetchJSON(`${API_BASE}/movie/${movieId}?language=en-US`),
          fetchJSON(
            `${process.env.TMDB_BASE_URL}/movie/${movieId}/videos?language=en-US`,
          ),
        ]);
        setDetails(detailsRes);
        setGenre(detailsRes.genres);
        const allVideos = videoRes.results;
        const officialTrailer = allVideos.find(
          (video: VideoTypes) =>
            video.site === "YouTube" &&
            video.type === "Trailer" &&
            video.official === true,
        );
        setVideos(officialTrailer ? [officialTrailer] : allVideos);
        console.log(detailsRes.genres);
        console.log("videores length:", videoRes.results.length);
      } catch (error) {
        console.error(error);
      }
    };

    dataFetch();
  }, [movieId]);

  return (
    <>
      <div className="w-full px-10 py-4 gap-10">
        <div className="flex justify-between">
          <h1 className="text-4xl font-medium">{details?.title}</h1>
          <div>
            <p>{details?.release_date}</p>
            <p className="flex">
              {" "}
              <Star style={{ color: "yellow", fill: "yellow" }} />
              {details?.vote_average.toFixed(1)}
            </p>
          </div>
        </div>
        <Carousel
          className="w-full aspect-12/5 overflow-hidden scrollbar-hide "
          style={{
            width: "full",
            aspectRatio: "12/5",
            scrollbarWidth: "none",
            padding: "0px",
            position: "relative",
            overflowX: "scroll",
          }}
        >
          <CarouselContent className="w-full overflow-auto">
            <CarouselItem
              className="aspect-190/107 bg-no-repeat bg-contain bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${details?.backdrop_path})`,
              }}
            ></CarouselItem>
            {videos.map((video) =>
              video.site === "YouTube" ? (
                <CarouselItem key={video.id}>
                  <iframe
                    className="w-full aspect-12/5 object-contain"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </CarouselItem>
              ) : null,
            )}
          </CarouselContent>
        </Carousel>
        <div>
          {" "}
          {genre.map((el, i) => (
            <Button
              key={i}
              className="scale-95 rounded-2xl px-2 py-0"
              variant={"outline"}
            >
              {el.name}
            </Button>
          ))}
        </div>
        <h3>{details?.overview}</h3>
      </div>

      <div></div>
    </>
  );
};
export default Moviedetails;

"use client";
import { useState, useEffect, ReactNode, use } from "react";
import Reactplayer from "react-player";
import { BaseStructure } from "@/app/_components/BaseStructure";
import { MovieTypes } from "@/app/_components/movietypes";
import { useTheme } from "@/app/Providers/ThemeContext";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DVDcard } from "@/app/_components/dvdcard";
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
type CastType = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
};
type Crewtype = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
};
interface CreditType {
  id: number;
  cast: CastType[];
  crew: Crewtype[];
}

interface SimilarresType {
  page: number;
  result: DataTypes[];
  total_pages: number;
  total_results: number;
}
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
  const [loading, setLoading] = useState(false);
  const { movieId } = use(params);
  const [details, setDetails] = useState<DataTypes>();
  const [videos, setVideos] = useState<VideoTypes[]>([]);
  const [genre, setGenre] = useState<Genre[]>([]);
  const [director, setDirector] = useState<Crewtype | Crewtype[]>([]);
  const [writer, setWriter] = useState<Crewtype | Crewtype[]>([]);
  const [star, setStar] = useState<CastType | CastType[]>([]);
  const [similar, setSimilar] = useState<DataTypes[]>([]);
  const { theme } = useTheme();
  const starIcon = theme === "dark" ? "white" : "yellow";

  const router = useRouter();
  useEffect(() => {
    const dataFetch = async () => {
      setLoading(true);
      try {
        const [detailsRes, videoRes, peopleRes, similarRes] = await Promise.all(
          [
            fetchJSON(`${API_BASE}/movie/${movieId}?language=en-US`),
            fetchJSON(
              `${process.env.TMDB_BASE_URL}/movie/${movieId}/videos?language=en-US`,
            ),
            fetchJSON(
              `${process.env.TMDB_BASE_URL}/movie/${movieId}/credits?language=en-US`,
            ),
            fetchJSON(
              `${process.env.TMDB_BASE_URL}/movie/${movieId}/similar?language=en-US&page=1`,
            ),
          ],
        );
        const similar: DataTypes[] = similarRes.results;
        console.log(similar);
        setSimilar(similar);
        const crew: Crewtype[] = peopleRes.crew;
        const cast: CastType[] = peopleRes.cast;
        // console.log(crew);
        const d = crew.filter((c) => c.job === "Director");
        setDirector(d);

        const w = crew.filter((c) => c.job === "Writer");

        setWriter(w);
        const s = cast.filter((c) => c.order < 3);
        setStar(s);

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

        console.log("videores length:", videoRes.results.length);
      } catch (error) {
        console.error(error);
      }
    };

    dataFetch();
  }, [movieId]);

  return (
    <>
      <div className="w-full px-10 py-4 gap-4 flex flex-col ">
        <div className="flex justify-between items-center">
          <p className="text-4xl  w-full font-medium">{details?.title}</p>
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
        <div className={`flex gap-2 `}>
          {" "}
          {genre.map((el, i) => (
            <Button
              key={i}
              className="scale-95 rounded-2xl "
              variant={"outline"}
            >
              {el.name}
            </Button>
          ))}
        </div>
        <div className={`flex gap-2 `}>{details?.overview}</div>{" "}
        <div className={`lg:w-1/2  grid grid-cols-5 w-full gap-0`}>
          <p className={`font-medium col-span-1`}>Director</p>{" "}
          <div className="col-span-4 flex gap-2">
            •
            {Array.isArray(director) ? (
              <>
                {director.map((d, index) => (
                  <p className="flex gap-2" key={index}>
                    {d.name} •
                  </p>
                ))}
              </>
            ) : (
              <>{director.name}</>
            )}
          </div>
          <p className={`font-medium col-span-1`}>Writer</p>{" "}
          <div className="col-span-4 flex gap-2">
            •
            {Array.isArray(writer) ? (
              <>
                {writer.map((d, i) => (
                  <p key={i}> {d.name} •</p>
                ))}
              </>
            ) : (
              <>{writer.name}•</>
            )}
          </div>
          <p className={`font-medium col-span-1`}>Star</p>
          <div className="col-span-4 flex gap-2">
            •
            {Array.isArray(star) ? (
              <>
                {star.map((d, i) => (
                  <p key={i}>{d.name} •</p>
                ))}
              </>
            ) : (
              <>{star.name} •</>
            )}
          </div>
        </div>
        <div className={`self-start `}>
          <p className={`text-xl font-medium`}>More Like This</p>
        </div>
        <div className={`w-full flex items-center justify-center`}>
          <Carousel opts={{ align: "start" }} className={` w-full max-w-490 `}>
            <CarouselContent className="gap-2 ">
              {similar.map((s) => (
                <CarouselItem
                  key={s.id}
                  onClick={() => {
                    router.push(`/moviedetails/${s.id}`);
                  }}
                  className={` xl:scale-90 duration-300 basis-1/5 flex flex-col gap-2 shadow-md rounded-2xl overflow-hidden p-0 ${theme === "dark" ? "bg-zinc-900 " : "shadow-gray-200"} `}
                >
                  <img
                    src={`${process.env.TMDB_IMAGE_SERVICE_URL}/original${s.poster_path}`}
                  />
                  <div className="p-5 ">
                    <div className="flex gap-2">
                      <Star style={{ fill: starIcon, color: starIcon }} />
                      <p>{s.vote_average}</p>
                    </div>
                    <p className={`text-xl font-medium`}>{s.title}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
            <CarouselPrevious />
          </Carousel>
        </div>
      </div>
    </>
  );
};
export default Moviedetails;

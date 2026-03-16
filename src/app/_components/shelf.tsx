import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MovieTypes } from "./movietypes";
import { DVDcard } from "./dvdcard";
import { useTheme } from "../Providers/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";
type ShelfProps<T> = {
  title: string;
  category: string;
};
export const Shelf = <T,>({ title, category }: ShelfProps<T>) => {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(10);
  const [dvds, setDvds] = useState<MovieTypes[]>([]);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/movie/${category}?language=en-US&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );
        const data = await res.json();
        setDvds(data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    dataFetch();
  }, []);

  return (
    <>
      <div className="w-full max-w-450">
        <div className="flex items-center justify-between p-4">
          <h1 className={`shelflabel`}>{title}</h1>

          {visibleCount < dvds.length && (
            <Button
              variant={"link"}
              className={`bg-transparent text-black w-30 text-[1em] hover:text-blue-500 ${theme === "dark" ? "text-white" : ""}`}
              onClick={() => {
                router.push(`/categories/${category}`);
              }}
            >
              See More
            </Button>
          )}
        </div>

        <div className="DVDshelf">
          {loading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={`animate-pulse bg-gray-500 rounded-2xl h-full aspect-23/44 overflow-hidden`}
                >
                  <Skeleton
                    className={`w-full bg-gray-400 aspect-23/34 rounded-none`}
                  ></Skeleton>
                  <div className="p-2 flex flex-col gap-2">
                    <Skeleton
                      className={`w-full lg:h-5 h-3 rounded-full bg-gray-400`}
                    ></Skeleton>
                    <Skeleton className="w-1/3 h-5 rounded-full bg-gray-400"></Skeleton>
                  </div>
                </Skeleton>
              ))}
            </>
          ) : (
            <>
              {dvds.slice(0, visibleCount).map((dvd, i) => (
                <DVDcard
                  id={dvd.id as number}
                  key={i}
                  title={dvd.title}
                  overview={dvd.overview}
                  poster_path={`https://image.tmdb.org/t/p/original${dvd.poster_path}`}
                  vote_average={dvd.vote_average}
                  vote_count={dvd.vote_count}
                ></DVDcard>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

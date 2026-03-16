"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { DVDcard } from "@/app/_components/dvdcard";
import { MovieTypes } from "@/app/_components/movietypes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

export type Genre = {
  id: any;
  name: string;
};

const genrePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);
  const router = useRouter();
  const [results, setResults] = useState<MovieTypes[]>([]);
  const searchparams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // ✅ FIX 1: Keep this as a plain string — strings are stable, arrays are not
  const genreIdParams = searchparams.get("genreIds") || "";

  // ✅ This is fine here — only used in handleClickgenre, not in useEffect deps
  const genreIds = genreIdParams.split(",").filter(Boolean);

  // Fetch genre list (runs once on mount)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/genre/movie/list?language=en`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );
        if (!res.ok) console.log("res not ok");
        const data = await res.json();
        setGenres(data.genres);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies based on selected genres and page
  useEffect(() => {
    const renderResults = async () => {
      try {
        const ids = genreIdParams.split(",").filter(Boolean);

        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/discover/movie?language=en&with_genres=${ids.join(",")}&page=${currentPage}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );
        const data = await res.json();
        if (!res.ok) console.log("res not ok");

        setResults(data.results);

        setTotalPage(data.total_pages);
      } catch (error) {
        console.log(error);
      }
    };
    renderResults();
  }, [genreIdParams, currentPage]);

  const handleClickgenre = (genreId: string) => {
    const params = new URLSearchParams(searchparams.toString());
    const updatedGenreIds = genreIds.includes(genreId)
      ? genreIds.filter((id) => id !== genreId)
      : [...genreIds, genreId];

    params.set("genreIds", updatedGenreIds.join(","));
    router.push(`?${params.toString()}`);
    setSelected(updatedGenreIds);
  };

  const nextpage = () => {
    if (currentPage < totalpage) setCurrentPage((prev) => prev + 1);
  };
  const prevpage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <div className="w-full px-[5em] py-[2em] flex flex-row">
        <div className="w-1/3 flex flex-col gap-2 p-2 lg:p-5">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={
                selected.includes(genre.id.toString()) ? "default" : "outline"
              }
              className="w-fit rounded-2xl"
              onClick={() => handleClickgenre(genre.id.toString())}
            >
              {genre.name}
              <ChevronRight strokeWidth={3} />
            </Button>
          ))}
        </div>

        <div className="w-2/3 h-full grid grid-cols-4 grid-rows-3 gap-3">
          {loading ? (
            <p>Loading...</p>
          ) : results.length === 0 ? (
            <p>No movies found for this genre.</p>
          ) : (
            results
              .slice(0, 12)
              .map((el, id) => (
                <DVDcard
                  key={id}
                  id={el.id}
                  title={el.title}
                  overview={el.overview}
                  poster_path={`${process.env.TMDB_IMAGE_SERVICE_URL}/original${el.poster_path}`}
                  popularity={el.popularity}
                  genre_ids={el.genre_ids}
                  vote_average={el.vote_average}
                />
              ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination className="w-full flex flex-row px-20 justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button onClick={prevpage} disabled={currentPage <= 1}>
              <ChevronLeft />
              Prev
            </Button>
          </PaginationItem>
          <PaginationItem>
            {currentPage} / {totalpage}
          </PaginationItem>
          <PaginationItem>
            <Button onClick={nextpage} disabled={currentPage >= totalpage}>
              Next
              <ChevronRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default genrePage;

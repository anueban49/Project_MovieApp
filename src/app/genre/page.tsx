"use client";
//page layout.specific: left side contains genre section, while right side contain filter function that sorts out the designed genre movies(4x3 grid with pagination).
import { useState, useEffect, use, ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { DVDcard } from "@/app/_components/dvdcard";
import { MovieTypes } from "@/app/_components/movietypes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft } from "lucide-react";

export type Genre = {
  id: any;
  name: string;
};

const genrePage = () => {
  const [currentPage, SetCurrentPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);
  const router = useRouter();
  const [results, setResults] = useState<MovieTypes[]>([]);
  const searchparams = useSearchParams();
  const genreIds = searchparams.get("genreIds")?.split(",") || [];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/genre/movie/list?language=en`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );
        if (!res.ok) {
          console.log("res not ok");
        }
        const data = await res.json();
        setGenres(data.genres);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGenres();
  }, []);
  useEffect(() => {
    const renderResults = async () => {
      try {
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/discover/movie?language=en&with_genres=${genreIds.join(",")}&page=${currentPage}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );
        const data = await res.json();
        if (!res.ok) {
          console.log("res not ok");
        }
        setResults(data.results);
        setTotalPage(results.length);
      } catch (error) {
        console.log(error);
      }
    };
    renderResults();
  }, [genreIds, currentPage]);

  const handleClickgenre = (genreId: string) => {
    const params = new URLSearchParams(searchparams.toString());
    const updatedGenreIds = genreIds?.includes(genreId)
      ? genreIds.filter((id) => id !== genreId)
      : [...genreIds, genreId];
    console.log(updatedGenreIds);
    params.set("genreIds", updatedGenreIds.join(","));
    router.push(`?${params.toString()}`);
    console.log(updatedGenreIds);
  };
  const nextpage = () => {
    SetCurrentPage((prev) => prev + 1);
  };
  const prevpage = () => {
    SetCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <div
        style={{ width: "full", height: "fit-content" }}
        className="w-full h-vh px-[5em] py-[2em] flex flex-row"
      >
        <div className="w-1/3">
          {genres.map((genre, id) => (
            <Button
              style={{
                padding: "2em, 0",
                borderRadius: "2em",
                fontSize: "1em",
                fontWeight: "400",
                scale: "0.8",
              }}
              key={genre.id}
              variant={"outline"}
              // onClick={() => genreSelect(genre.name, genre.id)}
              onClick={() => {
                handleClickgenre(genre.id.toString());
              }}
            >
              {genre.name}
              <ChevronRight strokeWidth={3} />
            </Button>
          ))}
        </div>
        <div className="w-2/3 h-full grid grid-cols-4 grid-rows-3">
          {results.slice(0, 12).map((el, id) => (
            <DVDcard
              key={id}
              title={el.title}
              overview={el.overview}
              poster_path={`${process.env.TMDB_IMAGE_SERVICE_URL}/original${el.poster_path}`}
              popularity={el.popularity}
              genre_ids={el.genre_ids}
              vote_average={el.vote_average}
            ></DVDcard>
          ))}
        </div>
      </div>
      <Pagination className="w-full flex flex-row px-20 justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button onClick={prevpage}>
              <ChevronLeft />
              Prev
            </Button>
          </PaginationItem>
          <PaginationItem>{currentPage}</PaginationItem>
          <PaginationItem>
            <Button onClick={nextpage}>
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

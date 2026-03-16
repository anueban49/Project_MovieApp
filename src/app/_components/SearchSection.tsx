"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Search, Star, StarIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../Providers/ThemeContext";
import { DataTypes } from "../moviedetails/[movieId]/page";

export const SearchSection = () => {
  const [value, setValue] = useState(""); // what user types
  const [query, setQuery] = useState(""); // actual search term
  const [results, setResults] = useState<DataTypes[]>([]); // array of movies
  const [page, setPage] = useState(1);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!query) return;
    const searchResults = async () => {
      try {
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/search/movie?query=${query}&language=en-US&page=${page}`,
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
      } catch (error) {
        console.log(error);
      }
    };

    searchResults();
  }, [query, page]);

  function runSearch() {
    setQuery(value);
    return (
      <div
        style={{
          position: "absolute",
          width: "20%",
          height: "95vh",
          zIndex: 99,
          backgroundColor: "white",
          overflow: "scroll",
        }}
      >
        <div className="overflow-scroll">
          {results.map((movie: any) => (
            <div className="p-4">{movie.title}</div>
          ))}
        </div>
      </div>
    );
  }
  const { theme } = useTheme();
  const starIcon = theme === "dark" ? "white" : "black";
  const router = useRouter();
  return (
    <div className={`w-1/3 flex flex-row gap-2 ease-in-out duration-300`}>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowResult(true);
          runSearch();
        }}
        onFocus={() => {
          setShowResult(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowResult(false), 150);
        }}
        placeholder="Search movies..."
      />

      <Button onClick={runSearch} variant={"ghost"}>
        <Search />
      </Button>
      {showResult ? (
        <div
          className={`w-screen absolute h-[50%] overflow-y-scroll  z-10 py-[5em] ease-in-out duration-300`}
        >
          <div className={`mx-auto my-10 z-99 max-w-xl flex flex-col gap-1`}>
            {results.map((movie, index) => (
              <Card
                key={index}
                onClick={() => {
                  router.push(`/moviedetails/${movie.id}`);
                  console.log(movie.id);
                }}
                style={{
                  backgroundImage: `url(${process.env.TMDB_IMAGE_SERVICE_URL}/original${movie.backdrop_path})`,
                }}
                className={` border-none overflow-hidden h-[5em] p-0 ${theme === "dark" ? "dark bg-black" : "light bg-white"} bg-center bg-cover bg-no-repeat  duration-150`}
              >
                <div
                  className={` flex flex-col p-2 searchcards h-full backdrop-blur-2xl hover:backdrop-blur-none duration-200 hover:bg-none`}
                >
                  <p className="p-1 ">{movie.title}</p>
                  <div className="flex gap-1">
                    <Star
                      className="scale-80"
                      style={{ color: starIcon, fill: starIcon }}
                    />
                    <p>{movie.vote_average}/10</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default SearchSection;
//onchange => display the searchResult window
//input onchange events show a block of blank
//when runSearch is called, it has to display actual values inside the blank block

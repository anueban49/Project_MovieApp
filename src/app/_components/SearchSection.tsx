"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { DVDcard } from "./dvdcard";
import { Button } from "@/components/ui/button";
import { MovieTypes } from "./movietypes";
export const SearchSection = () => {
  const [value, setValue] = useState(""); // what user types
  const [query, setQuery] = useState(""); // actual search term
  const [results, setResults] = useState([]); // array of movies
  const [page, setPage] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const searchParams = useSearchParams();

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
          }
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

  return (
    <>
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
          setShowResult(false);
        }}
        placeholder="Search movies..."
      />

      <Button onClick={runSearch}>Search</Button>
      {showResult && (
        <div
          style={{
            backgroundColor:"white",
            position: "absolute",
            top:"3em",
            right:"2em",
            width: "20%",
            height: "95vh",
            zIndex: 99,
            borderRadius: "2em",
            overflow: "scroll",
          }}
        >
          <div className="overflow-scroll">
            {results.map((movie: any) => (
              <DVDcard
              key={movie.id}
              title={movie.title}
              poster_path={`${process.env.TMDB_IMAGE_SERVICE_URL}/original${movie.poster_path}`}
              id={movie.id}
              key={movie.id}
              vote_average={movie.vote_average}
              
              ></DVDcard>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default SearchSection;
//onchange => display the searchResult window
//input onchange events show a block of blank
//when runSearch is called, it has to display actual values inside the blank block

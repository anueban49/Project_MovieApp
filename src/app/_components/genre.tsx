import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@radix-ui/react-select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Genre } from "./BaseStructure";

export const GenreSection = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
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
        const data = await res.json();
        setGenres(data.genres);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);
  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Genres</SelectLabel>
            {loading ? (
              <>Loading...</>
            ) : (
              <>
                {genres.map((genre: Genre) => (
                  <>
                    <SelectItem key={genre.id} value={genre.name}>
                      {genre.name}
                    </SelectItem>
                  </>
                ))}
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

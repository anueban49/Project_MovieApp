"use client";
import { useState, useEffect, ReactNode, use } from "react";
import { MovieTypes } from "@/app/_components/movietypes";
import { DVDcard } from "@/app/_components/dvdcard";
import { useParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
type Response = {
  page: number;
  results: Array<[]>;
};
type CategorySectionProps = {
  categoryName: string;
};
//when clciked, it fetches api data of that cerain media and renders it to an
const CategorySecton = () => {
  const { categoryName } = useParams<CategorySectionProps>();

  const [datas, setDatas] = useState<MovieTypes[]>([]);
  const [currentPage, SetCurrentPage] = useState(1);
  const [totalpage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const dataFetch = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.TMDB_BASE_URL}/movie/${categoryName}?language=en-US&page=${currentPage}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          },
        );
        const data = (await res.json()) as Response;
        setDatas(data.results);
        setTotalPage(data.page);
        console.log(data.results);
      } catch (error) {
        console.log(error);
      }
    };

    dataFetch();
  }, [categoryName, currentPage]);
  const nextpage = () => {
    SetCurrentPage((prev) => prev + 1);
  };
  const prevpage = () => {
    SetCurrentPage((prev) => prev - 1);
  };
  return (
    <>
      <div className="w-full px-10 py-4 gap-10 grid grid-cols-5 grid-rows-2">
        {datas.map((el, id) => (
          <DVDcard
            key={el.id}
            title={el.title}
            overview={el.overview}
            vote_average={el.vote_average}
            vote_count={el.vote_count}
            poster_path={`${process.env.TMDB_IMAGE_SERVICE_URL}/original${el.poster_path}`}
          />
        ))}
      </div>
      <Pagination className="w-fit m-0">
        <PaginationContent>
          <PaginationItem>
            <Button onClick={prevpage}>
              <ChevronLeft />
              Prev
            </Button>
          </PaginationItem>
          <PaginationItem>{totalpage}</PaginationItem>
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
export default CategorySecton;

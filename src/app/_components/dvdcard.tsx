"use client";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { title } from "process";
import { Card } from "@/components/ui/card";
import { useTheme } from "../Providers/ThemeContext";
type DVDcardProps = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  popularity?: number;
  genre_ids?: number[];
  vote_average: number;
  vote_count: number;
};

//dynamic router that fetches api with dynamic param, used altogether with custom component.
export const DVDcard = (props: DVDcardProps) => {
  const router = useRouter();
  const { theme } = useTheme();

  const starIcon = theme === "dark" ? "white" : "yellow";

  return (
    <>
      <Card
        className={`aspect-23/44 rounded-[1em] overflow-hidden bg-gray-200 p-0 gap-0 border-none ${theme === "dark" ? "bg-zinc-900 text-white" : "light"}`}
        onClick={() => {
          router.push(`/moviedetails/${props.id}`);
        }}
        // onClick={() => {console.log(props.id)}}
      >
        <div
          className=" aspect-23/34 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${props.poster_path})` }}
        ></div>
        <div className="flex flex-col" style={{ padding: "3%", gap: "3%" }}>
          <div className={`flex gap-2`}>
            <Star style={{ color: starIcon, fill: starIcon }} />
            {props?.vote_average.toFixed(1)}/10
          </div>

          <p>{props?.title}</p>
        </div>
      </Card>
    </>
  );
};

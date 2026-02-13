'use client';
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { title } from "process";
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
  return (
    <>
      <div className=" aspect-23/44 rounded-[1em] overflow-hidden bg-gray-200 scale-95" 
      onClick={() => { router.push(`/moviedynamic/moviedetails/${props.id}`)}}
      // onClick={() => {console.log(props.id)}}
      >
        <div
          className=" aspect-23/34 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${props.poster_path})` }}
        ></div>{" "}
        <div className="flex flex-col" style={{padding:"3%", gap:"3%"}}>
          <p style={{ color: "black", display: "flex", gap: "5px", fontSize: "1em"}}>
            <Star style={{ color: "yellow", fill: "yellow" }} />
            {props?.vote_average.toFixed(1)}/10
          </p>

          <p style={{ color: "black", fontSize: "2rem", lineHeight:"1", fontWeight: "200" }}>
            {props?.title}
          </p>
        </div>
      </div>
    </>
  );
};

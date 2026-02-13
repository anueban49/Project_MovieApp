"use client";
export type BaseStructureType = {
  children: React.ReactNode;
};
export type Genre = {
  id: number;
  name: string;
};

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchSection } from "../_components/SearchSection";

// todos: implement search algorithm and genre function
export const BaseStructure = ({ children }: BaseStructureType) => {
  const router = useRouter();
  return (
    <div
      style={{
        boxSizing: "border-box",
        margin: "0%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        className="Header"
        style={{
          maxWidth: "vw",
          margin: "0%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "1%",
        }}
      >
        <span>
          <img
            // homepage Logo
            src="\movie\icons\Logo.jpg"
            alt="MovieZ"
            onClick={() => {
              router.push(`/moviedynamic`);
            }}
          />
        </span>
        <div className="flex gap-2"></div>
        <div className="flex">
          <Button variant={"outline"} onClick={() => { router.push(`/moviedynamic/genre`) }}>Genres</Button>

          <SearchSection></SearchSection>
        </div>

        <span>
          <Moon />
        </span>
      </div>
      <div className="relative z-10">{children}</div>
      <footer className="bg-indigo-700 w-screen min-w-300 h-70"></footer>
    </div>
  );
};

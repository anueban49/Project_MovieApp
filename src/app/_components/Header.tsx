"use client";
import { useTheme } from "../Providers/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Eclipse } from "lucide-react";
import { LogoRouter } from "./LogoRouter";
import SearchSection from "./SearchSection";
export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`ease-in-out duration-300 w-full h-20 flex flex-row justify-between gap-6 items-center p-4 ${theme === "dark" ? "dark" : "light"}`}
    >
      <LogoRouter />
      <SearchSection />
      <Button
        onClick={() => {
          toggleTheme();
        }}
        variant={"ghost"}
        className="rounded-full"
      >
        {theme === "dark" ? (
          <>
            <Eclipse />
          </>
        ) : (
          <>
            <Moon />
          </>
        )}
      </Button>
    </div>
  );
};

"use client";
export type BaseStructureType = {
  children: React.ReactNode;
};
export type Genre = {
  id: number;
  name: string;
};

import { useTheme } from "../Providers/ThemeContext";
import { Header } from "./Header";
import { Footer } from "react-day-picker";

// todos: implement search algorithm and genre function
export const BaseStructure = ({ children }: BaseStructureType) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex flex-col items-center ${theme === "dark" ? "dark" : "light"}`}
    >
      <Header />

      {children}

      <Footer />
    </div>
  );
};

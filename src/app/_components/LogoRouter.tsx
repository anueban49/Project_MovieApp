"use client";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../Providers/ThemeContext";
import { useRouter } from "next/navigation";
export const LogoRouter = () => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <Button
    onClick={() => {router.push("/")}}
      variant={"ghost"}
      className={` transition flex items-center justify-center gap-2 ${theme === "dark" ? "dark" : "light"}`}
    >
      <Film
        className={`${theme === "dark" ? "text-white" : "text-indigo-700"}`}
      />
      <p
        className={`font-bold italic ${theme === "dark" ? "text-white" : "text-indigo-700"}`}
      >
        Movie Z
      </p>
    </Button>
  );
};

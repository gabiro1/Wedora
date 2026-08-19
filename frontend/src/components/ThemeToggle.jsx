"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-champagne dark:hover:bg-white/10 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      <Sun className={`h-4.5 w-4.5 text-warm-gray absolute transition-all duration-300 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`} />
      <Moon className={`h-4.5 w-4.5 text-warm-gray absolute transition-all duration-300 ${theme === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
    </button>
  );
}

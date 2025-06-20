"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SettingMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";
  return (
    <>
      <div className="flex justify-center items-center w-full gap-[10%] ">
        <h2>Theme:</h2>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={isDark}
            onChange={() => setTheme(isDark ? "light" : "dark")}
          />
          <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative transition-colors duration-300">
            <span
              className={`absolute left-0 top-0 w-6 h-6 bg-white dark:bg-black rounded-full shadow-md transform transition-transform duration-300 ${
                isDark ? "translate-x-6" : ""
              }`}
            />
          </div>
          <span className="ml-2 text-gray-800 ">
            {isDark ? "Dark" : "Light"}
          </span>
        </label>
      </div>
    </>
  );
}

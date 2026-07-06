import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="soft-button h-11 w-11 rounded-full p-0"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

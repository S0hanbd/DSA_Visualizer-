import { Network } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { categories, algorithmMap } from "../data/algorithms.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  const navigate = useNavigate(),
    location = useLocation();
  const current = location.pathname.startsWith("/algorithm/")
    ? location.pathname.split("/").at(-1)
    : "";
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-slate-100/90 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:bg-cyan-400 dark:text-slate-950">
            <Network size={23} />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black">DSA Visualizer</span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Premium learning lab
            </span>
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <label className="max-w-36 sm:max-w-64 xl:hidden text-xs font-bold">
            Choose visualization
            <select
              aria-label="Choose visualization"
              className="block w-full min-w-0 rounded-lg border border-slate-300 bg-white dark:bg-slate-800 p-2"
              value={current}
              onChange={(event) =>
                navigate(
                  event.target.value ? `/algorithm/${event.target.value}` : "/",
                )
              }
            >
              <option value="">Algorithm catalog</option>
              {categories.map((category) => (
                <optgroup key={category.name} label={category.name}>
                  {category.algorithms.map((slug) => (
                    <option key={slug} value={slug}>
                      {algorithmMap[slug].title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

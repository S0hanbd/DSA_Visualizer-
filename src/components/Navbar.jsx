import { Network } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-slate-100/90 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:bg-cyan-400 dark:text-slate-950">
            <Network size={23} />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black">DSA Visualizer</span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Premium learning lab</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

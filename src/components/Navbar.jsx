import { Menu, Network, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { algorithmMap } from "../data/algorithms.js";

const navItems = [
  ["Home", "/"],
  ["Sorting", "/algorithm/bubble-sort"],
  ["Searching", "/algorithm/linear-search"],
  ["Linked List", "/algorithm/singly-linked-list"],
  ["Stack", "/algorithm/stack-array"],
  ["Queue", "/algorithm/linear-queue"],
  ["Trees", "/algorithm/binary-tree"],
  ["Graph", "/algorithm/bfs"],
];

function NavItems({ onClick }) {
  const location = useLocation();

  const getIsActive = (path) => {
    if (location.pathname === path) return true;

    if (location.pathname.startsWith("/algorithm/")) {
      const slug = location.pathname.split("/").pop();
      const algo = algorithmMap[slug];
      if (algo) {
        const categoryMap = {
          "Sorting": "/algorithm/bubble-sort",
          "Searching": "/algorithm/linear-search",
          "Linked List": "/algorithm/singly-linked-list",
          "Stack": "/algorithm/stack-array",
          "Queue": "/algorithm/linear-queue",
          "Trees": "/algorithm/binary-tree",
          "Graphs": "/algorithm/bfs",
        };
        return categoryMap[algo.category] === path;
      }
    }
    return false;
  };

  return navItems.map(([label, path]) => (
    <NavLink
      key={label}
      to={path}
      onClick={onClick}
      className={() =>
        `rounded-2xl px-3 py-2 text-sm font-semibold transition ${
          getIsActive(path)
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:bg-cyan-400 dark:text-slate-950"
            : "text-slate-600 hover:bg-white/70 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
        }`
      }
    >
      {label}
    </NavLink>
  ));
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

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

        <div className="hidden items-center gap-1 lg:flex">
          <NavItems />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button type="button" className="soft-button h-11 w-11 p-0 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/70 px-4 pb-4 dark:border-slate-800 lg:hidden">
          <div className="mx-auto flex w-full flex-col gap-2 rounded-3xl bg-slate-100/80 p-3 shadow-neo dark:bg-slate-900 dark:shadow-dark-neo">
            <NavItems onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

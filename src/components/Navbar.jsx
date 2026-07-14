import { AnimatePresence, motion } from "framer-motion";
import { Network, ArrowUpDown, GitFork, Grid, Layers, Link, MoreHorizontal, RefreshCw, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useSearchFilter } from "../hooks/useSearchFilter.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import SearchBar from "./SearchBar.jsx";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    setShowAll,
    isSticky,
  } = useSearchFilter();

  const showFilters = isHome && isSticky;

  const categoryOptions = [
    { name: "All", label: "All", icon: Grid },
    { name: "Sorting", label: "Sorting", icon: ArrowUpDown },
    { name: "Searching", label: "Searching", icon: Search },
    { name: "Linked List", label: "Linked List", icon: Link },
    { name: "Stack", label: "Stack", icon: Layers },
    { name: "Queue", label: "Queue", icon: RefreshCw },
    { name: "Tree", label: "Tree", icon: GitFork },
    { name: "Graph", label: "Graph", icon: Network },
    { name: "Other", label: "Other", icon: MoreHorizontal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 dark:bg-slate-900/95 dark:border-slate-700/50 dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]">

      <nav className="mx-auto flex w-full items-center justify-between px-4 py-3">
        {/* Left: Logo + Search (when sticky) */}
        <div className="flex items-center gap-3 shrink-0">
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:bg-cyan-400 dark:text-slate-950">
              <Network size={20} />
            </span>
            <span className="leading-tight hidden sm:block">
              <span className="block text-md font-black select-none text-slate-900 dark:text-white">DSA Visualizer</span>
              <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 select-none">Premium learning lab</span>
            </span>
          </NavLink>

          {/* Compact search bar beside logo when scrolled */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="w-40 ml-2">
                  <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search..."
                    compact={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Category Filters (when sticky) */}
        <div className="flex-1 flex items-center justify-center min-w-0 mx-4">
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center overflow-x-auto no-scrollbar"
              >
                <div className="flex flex-nowrap gap-1.5 py-1">
                  {categoryOptions.map((opt) => {
                    const isActive = selectedCategory === opt.name;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => {
                          setSelectedCategory(opt.name);
                          setShowAll(false);
                        }}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold tracking-wide transition duration-150 whitespace-nowrap ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 dark:bg-cyan-500 dark:text-slate-950"
                            : "bg-slate-200/50 text-slate-600 hover:bg-slate-200 hover:text-blue-600 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                        }`}
                      >
                        <Icon size={12} className={isActive ? "text-white dark:text-slate-950" : "text-blue-600 dark:text-cyan-400"} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}


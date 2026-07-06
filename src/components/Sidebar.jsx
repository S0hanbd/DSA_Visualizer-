import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { algorithmMap, categories } from "../data/algorithms.js";

export default function Sidebar() {
  const { slug } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(() => new Set(["Sorting", "Searching"]));

  useEffect(() => {
    if (!slug) return;
    const algorithm = algorithmMap[slug];
    if (algorithm && algorithm.category) {
      setExpanded((prev) => {
        if (prev.has(algorithm.category)) return prev;
        const next = new Set(prev);
        next.add(algorithm.category);
        return next;
      });
    }
  }, [slug]);

  const toggle = (name) => {
    setExpanded((current) => {
      const next = new Set(current);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <aside className={`neo-panel sticky top-24 hidden max-h-[calc(100vh-7rem)] shrink-0 overflow-auto p-3 transition-all duration-300 xl:block ${collapsed ? "w-20" : "w-72"}`}>
      <button className="soft-button mb-3 w-full" onClick={() => setCollapsed((value) => !value)}>
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        {!collapsed && <span>Sidebar</span>}
      </button>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.name}>
            <button
              type="button"
              onClick={() => toggle(category.name)}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-black text-slate-700 transition hover:bg-white/70 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <span>{collapsed ? category.name.slice(0, 2) : category.name}</span>
              {!collapsed && <ChevronDown size={16} className={`transition ${expanded.has(category.name) ? "rotate-180" : ""}`} />}
            </button>
            {!collapsed && expanded.has(category.name) && (
              <div className="ml-2 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
                {category.algorithms.map((slug) => (
                  <NavLink
                    key={slug}
                    to={`/algorithm/${slug}`}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        isActive ? "bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950" : "text-slate-500 hover:bg-white/70 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                      }`
                    }
                  >
                    {algorithmMap[slug].title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

import { Github, Linkedin, Twitter, Network, Terminal, BookOpen, Heart, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-24 w-full bg-slate-900 text-slate-400 transition-colors duration-500 dark:bg-slate-950">
      {/* Landscape SVG Divider Layer */}
      <div className="relative w-full border-b border-slate-800 bg-slate-100/50 py-4 transition-colors duration-500 dark:bg-slate-900/10">
        <div className="mx-auto max-w-7xl px-6">
          <svg
            viewBox="0 0 1200 120"
            className="w-full text-slate-400/80 dark:text-slate-700/60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizon line */}
            <line x1="0" y1="105" x2="1200" y2="105" className="stroke-slate-300 dark:stroke-slate-800" strokeWidth="2" />

            {/* Binary Tree (Left: x = 50 to 250) */}
            <g className="stroke-slate-300 dark:stroke-slate-800" strokeWidth="2">
              <line x1="150" y1="20" x2="100" y2="55" />
              <line x1="150" y1="20" x2="200" y2="55" />
              <line x1="100" y1="55" x2="70" y2="90" />
              <line x1="100" y1="55" x2="130" y2="90" />
              <line x1="200" y1="55" x2="170" y2="90" />
              <line x1="200" y1="55" x2="230" y2="90" />
              <line x1="70" y1="90" x2="70" y2="105" strokeDasharray="3 3" />
              <line x1="130" y1="90" x2="130" y2="105" strokeDasharray="3 3" />
              <line x1="170" y1="90" x2="170" y2="105" strokeDasharray="3 3" />
              <line x1="230" y1="90" x2="230" y2="105" strokeDasharray="3 3" />
            </g>
            <g className="fill-white stroke-blue-600/70 dark:fill-slate-900 dark:stroke-cyan-400/70" strokeWidth="2">
              <circle cx="150" cy="20" r="9" />
              <circle cx="100" cy="55" r="9" />
              <circle cx="200" cy="55" r="9" />
              <circle cx="70" cy="90" r="9" />
              <circle cx="130" cy="90" r="9" />
              <circle cx="170" cy="90" r="9" />
              <circle cx="230" cy="90" r="9" />
            </g>

            {/* Linked List (Middle-Left: x = 350 to 570) */}
            <g className="stroke-slate-300 dark:stroke-slate-800" strokeWidth="2">
              <path d="M400 55 H430 M424 50 L430 55 L424 60" fill="none" />
              <path d="M480 55 H510 M504 50 L510 55 L504 60" fill="none" />
              <path d="M560 55 H590 M584 50 L590 55 L584 60" fill="none" />
              {/* Supports to horizon */}
              <line x1="375" y1="70" x2="375" y2="105" strokeDasharray="3 3" />
              <line x1="455" y1="70" x2="455" y2="105" strokeDasharray="3 3" />
              <line x1="535" y1="70" x2="535" y2="105" strokeDasharray="3 3" />
            </g>
            <g className="fill-white stroke-blue-600/70 dark:fill-slate-900 dark:stroke-cyan-400/70" strokeWidth="2">
              <rect x="350" y="40" width="50" height="30" rx="6" />
              <line x1="385" y1="40" x2="385" y2="70" className="stroke-slate-200 dark:stroke-slate-800" />
              
              <rect x="430" y="40" width="50" height="30" rx="6" />
              <line x1="465" y1="40" x2="465" y2="70" className="stroke-slate-200 dark:stroke-slate-800" />
              
              <rect x="510" y="40" width="50" height="30" rx="6" />
              <line x1="545" y1="40" x2="545" y2="70" className="stroke-slate-200 dark:stroke-slate-800" />
              
              <circle cx="600" cy="55" r="7" className="fill-blue-500/10 stroke-blue-600/60 dark:fill-cyan-400/10 dark:stroke-cyan-400/60" />
              <line x1="595" y1="65" x2="605" y2="65" />
              <line x1="597" y1="69" x2="603" y2="69" />
            </g>

            {/* Sorting Bars / Columns (Middle-Right: x = 700 to 860) */}
            <g className="fill-blue-600/10 stroke-blue-600/60 dark:fill-cyan-400/10 dark:stroke-cyan-400/50" strokeWidth="2">
              <rect x="700" y="80" width="16" height="25" rx="3" />
              <rect x="725" y="60" width="16" height="45" rx="3" />
              {/* Swap/Comparison Highlights */}
              <rect x="750" y="30" width="16" height="75" rx="3" className="fill-red-500/10 stroke-red-500/70" />
              <rect x="775" y="45" width="16" height="60" rx="3" className="fill-orange-500/10 stroke-orange-500/70" />
              <rect x="800" y="70" width="16" height="35" rx="3" />
              <rect x="825" y="55" width="16" height="50" rx="3" />
              <rect x="850" y="20" width="16" height="85" rx="3" />
            </g>

            {/* Graph Network (Right: x = 950 to 1100) */}
            <g className="stroke-slate-300 dark:stroke-slate-800" strokeWidth="2">
              <line x1="970" y1="40" x2="1030" y2="25" />
              <line x1="1030" y1="25" x2="1080" y2="65" />
              <line x1="1080" y1="65" x2="1010" y2="90" />
              <line x1="1010" y1="90" x2="950" y2="70" />
              <line x1="950" y1="70" x2="970" y2="40" />
              <line x1="970" y1="40" x2="1010" y2="90" />
              <line x1="1030" y1="25" x2="1010" y2="90" />
              {/* Stand-offs to horizon */}
              <line x1="1010" y1="90" x2="1010" y2="105" strokeDasharray="3 3" />
              <line x1="950" y1="70" x2="950" y2="105" strokeDasharray="3 3" />
              <line x1="1080" y1="65" x2="1080" y2="105" strokeDasharray="3 3" />
            </g>
            <g className="fill-white stroke-blue-600/70 dark:fill-slate-900 dark:stroke-cyan-400/70" strokeWidth="2">
              <circle cx="970" cy="8" r="8" className="hidden" /> {/* dummy placeholder to keep compile simple if any */}
              <circle cx="970" cy="40" r="8" />
              <circle cx="1030" cy="25" r="8" />
              <circle cx="1080" cy="65" r="8" />
              <circle cx="1010" cy="90" r="8" />
              <circle cx="950" cy="70" r="8" />
            </g>
          </svg>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Identity */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:bg-cyan-400 dark:text-slate-950">
                <Network size={20} />
              </span>
              <span className="text-lg font-black text-white dark:text-slate-100">
                DSA Visualizer
              </span>
            </Link>
            <p className="text-sm leading-6 text-slate-400 dark:text-slate-400">
              A premium interactive frontend learning laboratory for studying key algorithms, computational structures, and code logic step by step.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white dark:text-slate-100">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/sorting" className="hover:text-white transition duration-200">Sorting Algorithms</Link>
              </li>
              <li>
                <Link to="/searching" className="hover:text-white transition duration-200">Searching Algorithms</Link>
              </li>
              <li>
                <Link to="/linked-list" className="hover:text-white transition duration-200">Linked Lists</Link>
              </li>
              <li>
                <Link to="/trees" className="hover:text-white transition duration-200">Trees & Heaps</Link>
              </li>
              <li>
                <Link to="/graph" className="hover:text-white transition duration-200">Graphs & Networks</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white dark:text-slate-100">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/design" className="flex items-center gap-1 hover:text-white transition duration-200">
                  <Terminal size={14} />
                  <span>UI Design System</span>
                </Link>
              </li>
              <li>
                <a href="#features" className="flex items-center gap-1 hover:text-white transition duration-200">
                  <BookOpen size={14} />
                  <span>Dashboard Features</span>
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition duration-200">
                  <Cpu size={14} />
                  <span>C++ Architectures</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Newsletter Block */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white dark:text-slate-100">
              Premium Lab
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-400 dark:text-slate-400">
              Ready to learn computer science visually? Navigate the complete DSA roadmap using our interactive tools.
            </p>
            <div className="mt-4">
              <Link to="/algorithm/bubble-sort" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">
                <span>Start Visualizing</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} DSA Visualizer. All rights reserved.</p>
          <p className="flex items-center gap-1.5 justify-center">
            <span>Built for educators & developers with</span>
            <Heart size={12} className="text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Github, Linkedin, Twitter, Network, Terminal, BookOpen, Heart, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-24 w-full bg-slate-900 text-slate-400 transition-colors duration-500 dark:bg-slate-950">

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

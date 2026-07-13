import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative flex items-center w-full rounded-full bg-[#f3f5f8] dark:bg-slate-800 px-6 py-3 border border-black dark:border-slate-700 shadow-[6px_6px_12px_#d1d9e6,_-6px_-6px_12px_#ffffff] dark:shadow-[6px_6px_12px_#020617,_-6px_-6px_12px_rgba(51,65,85,0.2)]">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm font-semibold text-slate-600 outline-none placeholder:text-slate-450 dark:text-slate-200 [appearance:none] [&::-webkit-search-cancel-button]:hidden"
      />
      <Search size={18} className="text-slate-400 dark:text-slate-500 shrink-0 ml-2" />
    </div>
  );
}

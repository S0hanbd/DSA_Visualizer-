import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search algorithms" }) {
  return (
    <label className="neo-inset flex items-center gap-3 px-4 py-3">
      <Search size={19} className="text-blue-600 dark:text-cyan-300" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
      />
    </label>
  );
}

import { createContext, useContext, useState, useMemo } from "react";

const SearchFilterContext = createContext(null);

export function SearchFilterProvider({ children }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      selectedCategory,
      setSelectedCategory,
      showAll,
      setShowAll,
      isSticky,
      setIsSticky,
    }),
    [query, selectedCategory, showAll, isSticky]
  );

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error("useSearchFilter must be used within SearchFilterProvider");
  }
  return context;
}

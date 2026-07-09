import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AlgorithmPage from "./pages/AlgorithmPage.jsx";
import LinkedListPage from "./pages/LinkedListPage.jsx";
import { ThemeProvider } from "./hooks/useTheme.jsx";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.26, ease: "easeOut" }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/algorithm/singly-linked-list" element={<LinkedListPage />} />
          <Route path="/algorithm/doubly-linked-list" element={<LinkedListPage />} />
          <Route path="/algorithm/circular-linked-list" element={<LinkedListPage />} />
          <Route path="/algorithm/:slug" element={<AlgorithmPage />} />
          <Route path="/sorting" element={<Navigate to="/algorithm/bubble-sort" replace />} />
          <Route path="/searching" element={<Navigate to="/algorithm/linear-search" replace />} />
          <Route path="/linked-list" element={<Navigate to="/algorithm/singly-linked-list" replace />} />
          <Route path="/stack" element={<Navigate to="/algorithm/stack-array" replace />} />
          <Route path="/queue" element={<Navigate to="/algorithm/linear-queue" replace />} />
          <Route path="/trees" element={<Navigate to="/algorithm/binary-tree" replace />} />
          <Route path="/graph" element={<Navigate to="/algorithm/bfs" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

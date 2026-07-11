import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AlgorithmPage from "./pages/AlgorithmPage.jsx";
import LinkedListPage from "./pages/LinkedListPage.jsx";
import TreePage from "./pages/TreePage.jsx";
import StackPage from "./pages/StackPage.jsx";
import QueuePage from "./pages/QueuePage.jsx";
import CircularQueuePage from "./pages/CircularQueuePage.jsx";
import PriorityQueuePage from "./pages/PriorityQueuePage.jsx";
import QueueUsingStacksPage from "./pages/QueueUsingStacksPage.jsx";
import GraphPage from "./pages/GraphPage.jsx";
import NQueensPage from "./pages/NQueensPage.jsx";
import DesignPage from "./pages/DesignPage.jsx";
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
          
          <Route path="/algorithm/binary-tree" element={<TreePage />} />
          <Route path="/algorithm/bst" element={<TreePage />} />
          <Route path="/algorithm/avl" element={<TreePage />} />
          <Route path="/algorithm/tree-traversal" element={<TreePage />} />
          <Route path="/algorithm/max-heap" element={<TreePage />} />
          
          <Route path="/algorithm/stack-array" element={<StackPage />} />
          <Route path="/algorithm/linear-queue" element={<QueuePage />} />
          <Route path="/algorithm/circular-queue" element={<CircularQueuePage />} />
          <Route path="/algorithm/priority-queue" element={<PriorityQueuePage />} />
          <Route path="/algorithm/queue-using-stacks" element={<QueueUsingStacksPage />} />
          
          <Route path="/algorithm/dijkstra" element={<GraphPage />} />
          <Route path="/algorithm/bfs" element={<GraphPage />} />
          <Route path="/algorithm/dfs" element={<GraphPage />} />
          <Route path="/algorithm/prim" element={<GraphPage />} />
          <Route path="/algorithm/kruskal" element={<GraphPage />} />
          
          <Route path="/algorithm/n-queens" element={<NQueensPage />} />
          <Route path="/algorithm/:slug" element={<AlgorithmPage />} />
          <Route path="/sorting" element={<Navigate to="/algorithm/bubble-sort" replace />} />
          <Route path="/searching" element={<Navigate to="/algorithm/linear-search" replace />} />
          <Route path="/linked-list" element={<Navigate to="/algorithm/singly-linked-list" replace />} />
          <Route path="/stack" element={<Navigate to="/algorithm/stack-array" replace />} />
          <Route path="/queue" element={<Navigate to="/algorithm/linear-queue" replace />} />
          <Route path="/trees" element={<Navigate to="/algorithm/binary-tree" replace />} />
          <Route path="/graph" element={<Navigate to="/algorithm/bfs" replace />} />
          <Route path="/design" element={<DesignPage />} />
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

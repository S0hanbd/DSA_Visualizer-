import { capabilities, aliases } from "./data/capabilities.js";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { motion, useReducedMotion } from "framer-motion";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
const Home = lazy(() => import("./pages/Home.jsx"));
const AlgorithmPage = lazy(() => import("./pages/AlgorithmPage.jsx"));
const StructurePage = lazy(() => import("./pages/StructurePage.jsx"));
const GraphPage = lazy(() => import("./pages/GraphPage.jsx"));
const NQueensPage = lazy(() => import("./pages/NQueensPage.jsx"));
const GraphColoringPage = lazy(() => import("./pages/GraphColoringPage.jsx"));
const AdvancedPage = lazy(() => import("./pages/AdvancedPage.jsx"));
const GuidePage = lazy(() => import("./pages/GuidePage.jsx"));
const DesignPage = lazy(() => import("./pages/DesignPage.jsx"));
import { ThemeProvider } from "./hooks/useTheme.jsx";

function CatalogRoute() {
  const { slug } = useParams();
  const view = capabilities[slug]?.view;
  const Page = {
    array: AlgorithmPage,
    structure: StructurePage,
    graph: GraphPage,
    queens: NQueensPage,
    coloring: GraphColoringPage,
    advanced: AdvancedPage,
  }[view];
  return Page ? <Page /> : <Navigate to="/" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <motion.main
      key={location.pathname}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: "easeOut" }}
      className="flex-1"
    >
      <ErrorBoundary key={location.pathname}>
        <Suspense
          fallback={
            <p role="status" className="p-8">
              Loading visualization...
            </p>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/algorithm/:slug" element={<CatalogRoute />} />
            {Object.entries(aliases).map(([path, slug]) => (
              <Route
                key={path}
                path={path}
                element={<Navigate to={`/algorithm/${slug}`} replace />}
              />
            ))}
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </motion.main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <>
        <ScrollToTop />
        <div className="min-h-screen global-blueprint-bg text-slate-900 transition-colors duration-500 dark:text-slate-100 flex flex-col">
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </>
    </ThemeProvider>
  );
}

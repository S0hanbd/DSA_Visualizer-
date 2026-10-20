import { lazy, Suspense } from "react";
const Viewer = lazy(() => import("./CodeViewerContent.jsx"));
export default function CodeViewer(props) {
  return (
    <Suspense
      fallback={
        <p role="status" className="neo-panel p-5">
          Loading source code?
        </p>
      }
    >
      <Viewer {...props} />
    </Suspense>
  );
}

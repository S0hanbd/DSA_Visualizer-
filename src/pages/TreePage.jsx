import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useIsPresent, motion } from "framer-motion";
import Sidebar from "../components/Sidebar.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import TreeVisualization from "../components/TreeVisualization.jsx";
import { algorithmMap } from "../data/algorithms.js";
import {
  buildBSTInsertSteps,
  buildAVLInsertSteps,
  buildTraversalSteps,
  buildMaxHeapSteps,
  calculateTreeLayout
} from "../logic/treeInteractive.js";

const SLUGS = {
  "binary-tree": "bst",
  "bst": "bst",
  "avl": "avl",
  "tree-traversal": "traversal",
  "max-heap": "heap"
};

const SPEED_LABELS = { 900: "Slow", 480: "Normal", 200: "Fast", 80: "Turbo" };

function OpBtn({ label, onClick, color = "blue", disabled }) {
  const palette = {
    blue:   "bg-blue-600 hover:bg-blue-500",
    green:  "bg-emerald-600 hover:bg-emerald-500",
    violet: "bg-violet-600 hover:bg-violet-500",
    red:    "bg-red-600 hover:bg-red-500",
    amber:  "bg-amber-600 hover:bg-amber-500",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      className={`${palette[color]} text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </motion.button>
  );
}

export default function TreePage() {
  const { slug: routeSlug } = useParams();
  const location = useLocation();
  const isPresent = useIsPresent();

  const slug = routeSlug || location.pathname.replace(/\/$/, "").split("/").pop();

  const activeSlugRef = useRef(slug);
  if (isPresent && slug && slug !== activeSlugRef.current) {
    activeSlugRef.current = slug;
  }
  const activeSlug = activeSlugRef.current || slug;
  const algorithm = algorithmMap[activeSlug];

  const type = SLUGS[activeSlug];

  const [liveTree, setLiveTree] = useState(null);
  const [liveArray, setLiveArray] = useState([]); // For heaps
  
  const [steps, setSteps] = useState([{ tree: null, array: [], explanation: "Ready.", markers: {} }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(480);

  const [singleValue, setSingleValue] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const step = steps[currentStep] || steps[0];

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSteps([{ tree: null, array: [], explanation: `Ready for ${algorithm?.title}.`, markers: {} }]);
    setLiveTree(null);
    setLiveArray([]);
    setSingleValue("");
    setBulkValue("");
    setErrorMsg("");
  }, [location.pathname, algorithm?.title]);

  useEffect(() => {
    if (!isPlaying || !isPresent) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      if (type === "heap") {
          if (steps[steps.length - 1]?.array) setLiveArray([...steps[steps.length - 1].array]);
      } else {
          // Just preserve visual state, logic builders clone as needed
      }
      return;
    }
    const t = window.setTimeout(() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1)), speed);
    return () => window.clearTimeout(t);
  }, [currentStep, isPlaying, speed, steps, isPresent, type]);

  if (!algorithm) return <Navigate to="/" replace />;

  const parseValues = (str) => {
    return str
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 9999);
  };

  const getBuilderFn = () => {
    if (type === "heap") return buildMaxHeapSteps;
    if (type === "avl") return buildAVLInsertSteps;
    return buildBSTInsertSteps;
  };

  const runOp = useCallback((builderFn, isBulk = false) => {
    const valStr = isBulk ? bulkValue : singleValue;
    const values = parseValues(valStr);
    
    if (values.length === 0) {
      setErrorMsg("Enter valid number(s).");
      return;
    }
    setErrorMsg("");

    let newSteps = [];
    if (type === "heap") {
        newSteps = builderFn(liveArray, values);
        if (newSteps.length > 0) {
            setLiveArray([...newSteps[newSteps.length - 1].array]);
        }
    } else {
        newSteps = builderFn(liveTree, values);
        if (newSteps.length > 0) {
            setLiveTree(newSteps[newSteps.length - 1].tree);
        }
    }

    if (newSteps.length === 0) return;

    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    if (!isBulk) setSingleValue("");
    if (isBulk) setBulkValue("");
  }, [singleValue, bulkValue, liveTree, liveArray, type]);

  const runTraversal = useCallback((traversalType) => {
      if (!liveTree) {
          setErrorMsg("Tree is empty.");
          return;
      }
      setErrorMsg("");
      const newSteps = buildTraversalSteps(liveTree, traversalType);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(true);
  }, [liveTree]);

  const handleClear = () => {
      setLiveTree(null);
      setLiveArray([]);
      setSteps([{ tree: null, array: [], explanation: "Tree cleared.", markers: {} }]);
      setCurrentStep(0);
      setIsPlaying(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT CONTROLS */}
        <div className="w-full md:w-[400px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{algorithm.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{algorithm.description}</p>
          </div>

          {/* INSERT CONTROLS */}
          <div className="neo-panel p-4 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
              {type === "heap" ? "Heap Controls" : "Insert Node"}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Single Insert</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={singleValue}
                    onChange={(e) => setSingleValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") runOp(getBuilderFn()); }}
                    placeholder="Enter value"
                    className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <OpBtn label="Insert" onClick={() => runOp(getBuilderFn())} disabled={isPlaying} />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Bulk Insert (comma-separated)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") runOp(getBuilderFn(), true); }}
                    placeholder="e.g., 10, 5, 15, 2"
                    className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <OpBtn label="Insert All" onClick={() => runOp(getBuilderFn(), true)} disabled={isPlaying} />
                </div>
              </div>
              
              {errorMsg && <div className="text-red-500 text-xs font-medium">{errorMsg}</div>}
              
              <div className="pt-2">
                  <OpBtn label={`Clear ${type === "heap" ? "Heap" : "Tree"}`} color="red" onClick={handleClear} disabled={isPlaying} />
              </div>
            </div>
          </div>

          {/* TRAVERSAL CONTROLS */}
          {type !== "heap" && (
            <div className="neo-panel p-4 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                Traversal Controls
                </h3>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => runTraversal("in")} disabled={isPlaying} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">In-Order</button>
                    <button onClick={() => runTraversal("pre")} disabled={isPlaying} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Pre-Order</button>
                    <button onClick={() => runTraversal("post")} disabled={isPlaying} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Post-Order</button>
                </div>
                
                {step.markers?.history && step.markers.history.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block">Traversal History</label>
                        <div className="flex flex-wrap gap-2">
                            {step.markers.history.map((val, i) => (
                                <div key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded text-xs font-medium border border-blue-200 dark:border-blue-800/50">
                                    {val}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* HEAP ARRAY REPRESENTATION */}
          {type === "heap" && (
            <div className="neo-panel p-4 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                Array Representation
                </h3>
                <div className="flex flex-wrap gap-1">
                    {(step.array || []).map((val, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-[10px] text-slate-500">{i}</span>
                            <div className={`w-8 h-8 flex items-center justify-center font-medium rounded border 
                                ${step.markers?.swapping?.includes(`heap-${val}-${i}`) ? 'bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300' :
                                  step.markers?.comparing?.includes(`heap-${val}-${i}`) ? 'bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300' :
                                  'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}
                            `}>
                                {val}
                            </div>
                        </div>
                    ))}
                    {(!step.array || step.array.length === 0) && (
                        <div className="text-sm text-slate-500 italic">Heap is empty</div>
                    )}
                </div>
            </div>
          )}

        </div>

        {/* RIGHT VISUALIZATION */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0B1120] relative overflow-y-auto custom-scrollbar">
          <div className="p-4 flex-1 flex flex-col">
            <TreeVisualization tree={step.tree} markers={step.markers} type={type} />
            <div className="mt-4 flex flex-col items-center justify-center space-y-2">
                <div className="bg-slate-800 text-slate-200 px-4 py-2 rounded-full text-sm font-medium shadow-md">
                    {step.explanation}
                </div>
                {/* Simplified Playback Controls */}
                <div className="flex items-center gap-2 mt-4 bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={isPlaying || currentStep === 0} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50">
                        &larr; Prev
                    </button>
                    {isPlaying ? (
                        <button onClick={() => setIsPlaying(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Pause</button>
                    ) : (
                        <button onClick={() => setIsPlaying(true)} disabled={currentStep >= steps.length - 1} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">Play</button>
                    )}
                    <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={isPlaying || currentStep >= steps.length - 1} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50">
                        Next &rarr;
                    </button>
                    <select value={speed} onChange={e => setSpeed(Number(e.target.value))} className="ml-2 bg-slate-100 dark:bg-slate-800 text-sm p-2 rounded-lg outline-none cursor-pointer">
                        {Object.entries(SPEED_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                    </select>
                </div>
            </div>
          </div>
          
          <section className="grid gap-6 lg:grid-cols-2 p-4">
            <CodeViewer code={algorithm.code} language={algorithm.language} />
            <ExecutionSteps steps={steps} currentStep={currentStep} />
          </section>
        </div>
      </div>
    </div>
  );
}

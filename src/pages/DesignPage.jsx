import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

// Import all UI Components
import AlgorithmCard from "../components/AlgorithmCard.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";

// Import all Visualizer Components
import VisualizationBars from "../components/VisualizationBars.jsx";
import QueueVisualization from "../components/QueueVisualization.jsx";
import CircularQueueVisualization from "../components/CircularQueueVisualization.jsx";
import TreeVisualization from "../components/TreeVisualization.jsx";
import GraphVisualization from "../components/GraphVisualization.jsx";
import StackVisualization from "../components/StackVisualization.jsx";

function ColorSwatch({ name, hexLight, hexDark, bgLightClass, bgDarkClass, textClass }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-24 w-full rounded-2xl border shadow-sm transition-colors duration-500 flex items-end p-3 ${bgLightClass} dark:${bgDarkClass} border-slate-200 dark:border-slate-800`}>
        <span className={`font-mono text-xs font-bold ${textClass}`}>
          <span className="dark:hidden">{hexLight}</span>
          <span className="hidden dark:inline">{hexDark}</span>
        </span>
      </div>
      <div>
        <div className="font-bold text-slate-800 dark:text-slate-200">{name}</div>
        <div className="font-mono text-xs text-slate-500 dark:text-slate-400">{bgLightClass.replace('bg-', '')} / {bgDarkClass.replace('bg-', '')}</div>
      </div>
    </div>
  );
}

export default function DesignPage() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
        <header className="mb-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            Design System Showcase
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            A comprehensive look at the colors, typography, shadows, and interactive components that make up the DSA Visualizer.
          </p>
        </header>

        <div className="max-w-5xl mx-auto space-y-16 pb-20">
          
          {/* Colors Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
              Semantic Colors
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <ColorSwatch 
                name="Primary (Blue/Cyan)" 
                hexLight="#2563EB" hexDark="#06B6D4" 
                bgLightClass="bg-blue-600" bgDarkClass="bg-cyan-500" 
                textClass="text-white dark:text-slate-950" 
              />
              <ColorSwatch 
                name="Success (Emerald)" 
                hexLight="#10B981" hexDark="#10B981" 
                bgLightClass="bg-emerald-500" bgDarkClass="bg-emerald-500" 
                textClass="text-white dark:text-slate-950" 
              />
              <ColorSwatch 
                name="Danger (Red)" 
                hexLight="#EF4444" hexDark="#EF4444" 
                bgLightClass="bg-red-500" bgDarkClass="bg-red-500" 
                textClass="text-white dark:text-slate-950" 
              />
              <ColorSwatch 
                name="Warning (Amber/Orange)" 
                hexLight="#F59E0B" hexDark="#FB923C" 
                bgLightClass="bg-amber-500" bgDarkClass="bg-orange-400" 
                textClass="text-white dark:text-slate-950" 
              />
            </div>
            
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-8 mb-4">Animation States</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <ColorSwatch 
                name="Scanning / Searching" 
                hexLight="#6366F1" hexDark="#818CF8" 
                bgLightClass="bg-indigo-500" bgDarkClass="bg-indigo-400" 
                textClass="text-white dark:text-slate-950" 
              />
              <ColorSwatch 
                name="Comparing (Orange)" 
                hexLight="#F97316" hexDark="#F97316" 
                bgLightClass="bg-orange-500" bgDarkClass="bg-orange-500" 
                textClass="text-white dark:text-slate-950" 
              />
              <ColorSwatch 
                name="Left Subarray (Violet)" 
                hexLight="#8B5CF6" hexDark="#8B5CF6" 
                bgLightClass="bg-violet-500" bgDarkClass="bg-violet-500" 
                textClass="text-white dark:text-slate-950" 
              />
              <ColorSwatch 
                name="Right Subarray (Pink)" 
                hexLight="#EC4899" hexDark="#EC4899" 
                bgLightClass="bg-pink-500" bgDarkClass="bg-pink-500" 
                textClass="text-white dark:text-slate-950" 
              />
            </div>

            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-8 mb-4">Legend States (Example)</h3>
            <div className="neo-panel p-6 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm font-bold bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-blue-600 dark:text-cyan-300" /><span className="text-slate-600 dark:text-slate-300">Unsorted</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-indigo-500 dark:text-indigo-400" /><span className="text-slate-600 dark:text-slate-300">Comparing</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-amber-500" /><span className="text-slate-600 dark:text-slate-300">Key / Hole</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-red-500" /><span className="text-slate-600 dark:text-slate-300">Shifting Right</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-emerald-500" /><span className="text-slate-600 dark:text-slate-300">Sorted</span></div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-bold bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-blue-600 dark:text-cyan-300" /><span className="text-slate-600 dark:text-slate-300">Unsorted</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-orange-500" /><span className="text-slate-600 dark:text-slate-300">Comparing</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-red-500" /><span className="text-slate-600 dark:text-slate-300">Swapping</span></div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-current text-emerald-500" /><span className="text-slate-600 dark:text-slate-300">Sorted</span></div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-8 mb-4">Base Neutrals (Slate)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               <ColorSwatch name="Slate 50 / 950" hexLight="#F8FAFC" hexDark="#020617" bgLightClass="bg-slate-50" bgDarkClass="bg-slate-950" textClass="text-slate-500 dark:text-slate-400" />
               <ColorSwatch name="Slate 100 / 900" hexLight="#F1F5F9" hexDark="#0F172A" bgLightClass="bg-slate-100" bgDarkClass="bg-slate-900" textClass="text-slate-500 dark:text-slate-400" />
               <ColorSwatch name="Slate 200 / 800" hexLight="#E2E8F0" hexDark="#1E293B" bgLightClass="bg-slate-200" bgDarkClass="bg-slate-800" textClass="text-slate-600 dark:text-slate-300" />
               <ColorSwatch name="Slate 500 / 500" hexLight="#64748B" hexDark="#64748B" bgLightClass="bg-slate-500" bgDarkClass="bg-slate-500" textClass="text-slate-100 dark:text-slate-100" />
               <ColorSwatch name="Slate 900 / 100" hexLight="#0F172A" hexDark="#F1F5F9" bgLightClass="bg-slate-900" bgDarkClass="bg-slate-100" textClass="text-slate-100 dark:text-slate-800" />
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
              Typography
            </h2>
            <div className="neo-panel p-8 space-y-8">
              <div>
                <span className="muted-label">Page Title (4XL, Black)</span>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-2">The Quick Brown Fox</h1>
              </div>
              <div>
                <span className="muted-label">Section Header (2XL, Black)</span>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-2">The Quick Brown Fox</h2>
              </div>
              <div>
                <span className="muted-label">Body Text (Base, Regular)</span>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mt-2 max-w-2xl">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                </p>
              </div>
              <div>
                <span className="muted-label">Code Text (XL, Mono, Black)</span>
                <div className="font-mono text-xl font-black text-slate-800 dark:text-slate-200 mt-2">
                  array[index] = value;
                </div>
              </div>
            </div>
          </section>

          {/* Shadows & Containers */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
              Containers & Shadows
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2">
                <span className="muted-label pl-2">.neo-panel</span>
                <div className="neo-panel h-48 flex items-center justify-center p-6 text-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    Used as the primary structural container. Translucent background with soft <strong>shadow-neo</strong>. (28px radius)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="muted-label pl-2">.neo-inset</span>
                <div className="neo-inset h-48 flex items-center justify-center p-6 text-center">
                   <p className="text-slate-500 dark:text-slate-400">
                    Used for recessed areas like code blocks and visualizer tracks. <strong>shadow-neo-inset</strong>. (22px radius)
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Buttons & Interactions */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
              Buttons & Interactions
            </h2>
            <div className="neo-panel p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="muted-label">.primary-button</span>
                  <div className="flex gap-4">
                    <button className="primary-button">
                      Play Animation
                    </button>
                    <button className="primary-button bg-emerald-500 dark:bg-emerald-500 shadow-emerald-500/25 dark:shadow-emerald-500/25 hover:bg-emerald-400">
                      Success Action
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="muted-label">.soft-button</span>
                  <div className="flex gap-4">
                    <button className="soft-button">
                      Secondary Action
                    </button>
                    <button className="soft-button">
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Form Elements */}
                <div className="flex flex-col gap-4 max-w-sm">
                  <input
                    type="text"
                    placeholder="Input field..."
                    className="capsule-input w-full"
                  />
                  <label className="neo-inset flex items-center gap-3 px-4 py-3">
                    <span className="text-sm font-black">Slider</span>
                    <input type="range" className="w-full accent-blue-600 dark:accent-cyan-300" />
                  </label>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-2 max-w-sm w-full">
                  <span className="muted-label">Progress Bar (StatsPanel)</span>
                  <div className="neo-inset h-3 w-full overflow-hidden p-0.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 dark:from-cyan-300 dark:to-emerald-400" style={{ width: `65%` }} />
                  </div>
                </div>
              </div>

              {/* Framer Motion Animation Styles */}
              <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-3">
                <span className="muted-label">Framer Motion Animation Styles</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* Demo 1: Spring Toggle */}
                  <div className="neo-panel flex min-h-[250px] flex-col items-center justify-center gap-6">
                    <span className="text-xs font-bold text-slate-500">Spring & Rotate</span>
                    <div className="relative h-16 w-16">
                      <AnimatePresence mode="wait">
                        {isAnimating ? (
                          <motion.div
                            key="on"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30 dark:bg-blue-500"
                          >
                            ON
                          </motion.div>
                        ) : (
                          <motion.div
                            key="off"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-200 font-bold text-slate-500 shadow-inner dark:bg-slate-800 dark:text-slate-400"
                          >
                            OFF
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Demo 2: Layout Swap */}
                  <div className="neo-panel flex min-h-[250px] flex-col items-center justify-center gap-6">
                    <span className="text-xs font-bold text-slate-500">Layout (Swapping)</span>
                    <div className="flex h-24 items-end gap-2">
                      <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-8 rounded-t-md bg-emerald-500" style={{ height: isAnimating ? 40 : 80 }} />
                      <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-8 rounded-t-md bg-amber-500" style={{ height: isAnimating ? 80 : 40 }} />
                    </div>
                  </div>

                  {/* Demo 3: Node Pop */}
                  <div className="neo-panel flex min-h-[250px] flex-col items-center justify-center gap-6">
                    <span className="text-xs font-bold text-slate-500">Node Entry (Scale Spring)</span>
                    <AnimatePresence mode="wait">
                      {isAnimating && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-white shadow-md"
                        >
                          42
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Demo 4: Path Tracing */}
                  <div className="neo-panel flex min-h-[250px] flex-col items-center justify-center gap-6 relative">
                    <span className="text-xs font-bold text-slate-500 absolute top-6">Path Tracing (SVG Length)</span>
                    <svg width="100" height="100" viewBox="0 0 100 100" className="mt-6">
                      <motion.circle
                        cx="50" cy="50" r="40"
                        fill="none" strokeWidth="8"
                        className="stroke-indigo-500"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isAnimating ? 1 : 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>

                </div>

                <div className="flex justify-center mt-2">
                  <button onClick={() => setIsAnimating(!isAnimating)} className="soft-button">
                    Trigger All Animations
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Complex Components Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
              Cards & Windows
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Algorithm Card Demo */}
              <div className="space-y-4 flex flex-col">
                <span className="muted-label">AlgorithmCard</span>
                <div>
                  <AlgorithmCard 
                    algorithm={{
                      title: "Bubble Sort",
                      category: "Sorting",
                      slug: "bubble-sort",
                      complexities: { best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" }
                    }} 
                  />
                </div>
              </div>

              {/* Complexity Card Demo (Best) */}
              <div className="space-y-4 flex flex-col">
                <span className="muted-label">ComplexityCard</span>
                <div className="flex-1">
                   <ComplexityCard label="Best Case" value="O(1)" tone="green" />
                </div>
              </div>

              {/* Complexity Card Demo (Average) */}
              <div className="space-y-4 flex flex-col">
                <span className="muted-label">ComplexityCard (Orange)</span>
                <div className="flex-1">
                   <ComplexityCard label="Average Case" value="O(log n)" tone="orange" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Execution Steps Demo */}
              <div className="space-y-4 flex flex-col">
                <span className="muted-label">ExecutionSteps window</span>
                <div>
                  <ExecutionSteps 
                    steps={[
                      { explanation: "Initialize algorithm...", line: 1 },
                      { explanation: "Comparing elements at index 0 and 1.", line: 5 },
                      { explanation: "Swapping elements because left > right.", line: 8 },
                    ]}
                    currentStep={1}
                    onStepClick={() => {}}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <span className="muted-label">CodeViewer Window</span>
                <div>
                  <CodeViewer 
                    code={`function bubbleSort(arr) {\n  let n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    for (let j = 0; j < n - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        // Swap\n        let temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}`}
                    language="javascript"
                    activeLine={6}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Visualizer Animations Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
              Visualizer Engines & Animations
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Array / Bars Demo */}
              <div className="space-y-4">
                <span className="muted-label">VisualizationBars (Sorting/Searching)</span>
                <div className="neo-panel h-[400px] flex items-end justify-center pb-8 overflow-hidden">
                  <div className="w-[120%] scale-[0.8] origin-bottom flex justify-center">
                    <VisualizationBars 
                      step={{
                        array: [65, 30, 80, 45, 95, 20],
                        markers: {
                          compare: [1, 3], // 30 and 45
                          swap: [],
                          sorted: [4, 5], // 95, 20
                          active: 1
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Stack Demo */}
              <div className="space-y-4">
                <span className="muted-label">StackVisualization (Stack Array)</span>
                <div className="neo-panel h-[400px] flex items-center justify-center overflow-hidden">
                  <div className="w-[120%] scale-[0.65] flex justify-center">
                    <StackVisualization 
                      step={{
                        array: [10, 55, 33, 90],
                        markers: { topIdx: 3, operation: "Push" }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Linear Queue Demo */}
              <div className="space-y-4">
                <span className="muted-label">QueueVisualization (Linear Queue)</span>
                <div className="neo-panel h-[400px] flex items-center justify-center overflow-hidden">
                  <div className="w-[120%] scale-[0.75] flex justify-center">
                    <QueueVisualization 
                      step={{
                        array: [10, 24, 88, null, null, null, null, null, null, null],
                        front: 0,
                        rear: 2,
                        markers: { activeIdx: 2 }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Circular Queue Demo */}
              <div className="space-y-4">
                <span className="muted-label">CircularQueueVisualization</span>
                <div className="neo-panel h-[600px] flex items-center justify-center overflow-hidden relative">
                  <div className="w-full h-full scale-[0.85] origin-center absolute inset-0 flex items-center justify-center">
                    <div className="w-full -mt-16">
                      <CircularQueueVisualization 
                        step={{
                          array: [null, null, null, null, null, null, null, null, 99, 12],
                          front: 8,
                          rear: 9,
                          markers: { enqueuing: true, activeIdx: 9 }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tree Demo */}
              <div className="space-y-4">
                <span className="muted-label">TreeVisualization (Trees)</span>
                <div className="neo-panel h-[600px] flex items-center justify-center overflow-hidden relative">
                  <div className="w-full h-full">
                    <TreeVisualization 
                      tree={{
                        id: "1", val: 50, x: 0, y: 0,
                        left: { id: "2", val: 30, x: -100, y: 100, left: null, right: null },
                        right: { 
                          id: "3", val: 70, x: 100, y: 100, 
                          left: { id: "4", val: 60, x: 20, y: 200, left: null, right: null }, 
                          right: { id: "5", val: 80, x: 180, y: 200, left: null, right: null } 
                        }
                      }}
                      markers={{ active: "3", comparing: ["4"] }}
                    />
                  </div>
                </div>
              </div>

              {/* Graph Demo */}
              <div className="space-y-4">
                <span className="muted-label">GraphVisualization (Graphs)</span>
                <div className="neo-panel h-[600px] flex items-center justify-center overflow-hidden relative">
                  <div className="w-full h-full">
                    <GraphVisualization 
                      nodes={[
                        { id: "A", x: 100, y: 100, name: "A", value: 0 },
                        { id: "B", x: 300, y: 80, name: "B", value: Infinity },
                        { id: "C", x: 150, y: 300, name: "C", value: Infinity },
                        { id: "D", x: 350, y: 250, name: "D", value: Infinity },
                      ]}
                      edges={[
                        { source: "A", target: "B", weight: 4 },
                        { source: "A", target: "C", weight: 2 },
                        { source: "B", target: "C", weight: 5 },
                        { source: "B", target: "D", weight: 10 },
                        { source: "C", target: "D", weight: 3 },
                      ]}
                      step={{
                        markers: {
                          activeNode: "A",
                          checkingNode: "C",
                          activeEdge: { source: "A", target: "C" },
                          path: ["A", "C"],
                          visited: ["A"]
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

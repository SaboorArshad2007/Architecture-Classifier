import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Layers,
  Cpu,
  History,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BarChart3
} from "lucide-react";

import {
  BENCHMARK_SITES,
  BenchmarkSite
} from "./data/benchmarkData.ts";
import { CameraCaptureModal } from "./components/CameraCaptureModal.tsx";
import { HistoricalTimeline } from "./components/HistoricalTimeline.tsx";
import { PakistaniHeritageBadge, BadshahiMosqueLogo } from "./components/BadshahiMosqueLogo.tsx";
import { analyzeImageFileOrUrl, DynamicAnalysisResult } from "./utils/imageAnalyzer.ts";

export default function App() {
  const [activeTab, setActiveTab] = useState<"classifier" | "canons">("classifier");

  // Selection & Input State
  const [selectedSite, setSelectedSite] = useState<BenchmarkSite>(BENCHMARK_SITES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageTitle, setCustomImageTitle] = useState<string>("");
  const [customAnalysis, setCustomAnalysis] = useState<DynamicAnalysisResult | null>(null);

  // Camera modal state
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Visual explainability controls
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [camOpacity, setCamOpacity] = useState<number>(55);
  const [colorMap, setColorMap] = useState<"thermal" | "amber" | "emerald">("emerald");
  const [, setIsAnalyzing] = useState<boolean>(false);
  const [, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for clipboard paste events (Cmd+V / Ctrl+V to attach picture)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            processFile(blob, "Pasted Clipboard Image");
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Process file upload / attachment
  const processFile = async (file: File, customTitle?: string) => {
    const title = customTitle || file.name;
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string;
        setCustomImage(dataUrl);
        setCustomImageTitle(title);
        setIsAnalyzing(true);

        const result = await analyzeImageFileOrUrl(dataUrl);
        setCustomAnalysis(result);
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle live camera capture (already filtered by CameraCaptureModal)
  const handleCameraCapture = async (dataUrl: string) => {
    setCustomImage(dataUrl);
    setCustomImageTitle("Live Device Camera Photo");
    setIsAnalyzing(true);

    const result = await analyzeImageFileOrUrl(dataUrl);
    setCustomAnalysis(result);
    setIsAnalyzing(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  // Jump to benchmark classification from interactive timeline
  const handleTimelineSelectBenchmark = (site: BenchmarkSite) => {
    setSelectedSite(site);
    setCustomImage(null);
    setCustomAnalysis(null);
    setActiveTab("classifier");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Active prediction display data
  const currentDisplay = useMemo(() => {
    if (customImage && customAnalysis) {
      return {
        title: customImageTitle,
        yearOrSource: "User Photo / Live Input",
        creator: "Direct Upload / Camera",
        era: customAnalysis.era,
        confidence: customAnalysis.calibratedConfidence,
        entropy: customAnalysis.entropy,
        isOod: customAnalysis.isOod,
        oodReason: customAnalysis.oodReason,
        probabilities: customAnalysis.probabilities,
        diagnosticFeatures: customAnalysis.diagnosticFeatures,
        gradCamFocus: customAnalysis.gradCamFocus,
        imageUrl: customImage
      };
    }
    return {
      title: selectedSite.name,
      yearOrSource: selectedSite.yearBuilt,
      creator: `${selectedSite.creator} (${selectedSite.license})`,
      era: selectedSite.era,
      confidence: selectedSite.calibratedConfidence,
      entropy: selectedSite.entropy,
      isOod: selectedSite.isOod,
      oodReason: selectedSite.oodReason,
      probabilities: selectedSite.probabilities,
      diagnosticFeatures: selectedSite.diagnosticFeatures,
      gradCamFocus: selectedSite.gradCamFocus,
      imageUrl: selectedSite.imageUrl
    };
  }, [customImage, customAnalysis, customImageTitle, selectedSite]);

  // Color mapping helper for Grad-CAM
  const getHeatmapGradient = () => {
    const focus = currentDisplay.gradCamFocus;
    if (colorMap === "thermal") {
      return `radial-gradient(ellipse ${focus.radiusX}% ${focus.radiusY}% at ${focus.centerX}% ${focus.centerY}%, 
        rgba(239, 68, 68, ${camOpacity / 100}) 0%, 
        rgba(245, 158, 11, ${camOpacity / 100 * 0.85}) 40%, 
        rgba(59, 130, 246, ${camOpacity / 100 * 0.45}) 75%, 
        transparent 95%)`;
    } else if (colorMap === "amber") {
      return `radial-gradient(ellipse ${focus.radiusX}% ${focus.radiusY}% at ${focus.centerX}% ${focus.centerY}%, 
        rgba(245, 158, 11, ${camOpacity / 100}) 0%, 
        rgba(217, 119, 6, ${camOpacity / 100 * 0.85}) 40%, 
        rgba(180, 83, 9, ${camOpacity / 100 * 0.4}) 75%, 
        transparent 95%)`;
    } else {
      return `radial-gradient(ellipse ${focus.radiusX}% ${focus.radiusY}% at ${focus.centerX}% ${focus.centerY}%, 
        rgba(16, 185, 129, ${camOpacity / 100}) 0%, 
        rgba(5, 150, 105, ${camOpacity / 100 * 0.8}) 40%, 
        rgba(6, 78, 59, ${camOpacity / 100 * 0.4}) 75%, 
        transparent 95%)`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Camera Capture Modal with Image Filters */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Top Header */}
      <header className="border-b border-slate-800/90 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <PakistaniHeritageBadge size="md" />
            <div>
              <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                Pakistani Architecture Classifier
              </h1>
              <p className="text-xs text-slate-400">
                Identify architectural heritage across Mughal, Sikh, British Colonial, and Modern eras
              </p>
            </div>
          </div>

          {/* Simple & Clean Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab("classifier")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "classifier"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Classifier
            </button>
            <button
              onClick={() => setActiveTab("canons")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "canons"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Canons Guide
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ===================================================================== */}
        {/* TAB 1: CLASSIFIER & GRAD-CAM VIEW */}
        {/* ===================================================================== */}
        {activeTab === "classifier" && (
          <div className="space-y-6">

            {/* Quick Action Input Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Input Architecture Image
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Capture photo with cleanup filters, upload a file, or choose from benchmark monuments.
                  </p>
                </div>

                {customImage && (
                  <button
                    onClick={() => {
                      setCustomImage(null);
                      setCustomAnalysis(null);
                      setCustomImageTitle("");
                    }}
                    className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                  >
                    Reset to Benchmark
                  </button>
                )}
              </div>

              {/* Action Buttons: 1. Camera with Filters, 2. Attach File, 3. Preset Monuments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Camera Button */}
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/20 transition-all text-left flex items-center gap-3.5 group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform font-bold shadow-md shadow-emerald-500/20">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Live Camera Capture
                    </div>
                    <div className="text-[11px] text-slate-400">
                      With Grayscale, Sharpen & Contrast filters
                    </div>
                  </div>
                </button>

                {/* 2. Attach File / Picture */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all text-left flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                      Upload / Attach Photo
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Upload JPG/PNG or Paste (Ctrl+V)
                    </div>
                  </div>
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {/* 3. Preset Benchmark Dropdown */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Or Select Benchmark Monument:
                  </label>
                  <select
                    value={!customImage ? selectedSite.id : ""}
                    onChange={(e) => {
                      const found = BENCHMARK_SITES.find((s) => s.id === e.target.value);
                      if (found) {
                        setCustomImage(null);
                        setCustomAnalysis(null);
                        setSelectedSite(found);
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                  >
                    {customImage && <option value="">Custom Upload / Camera Image</option>}
                    {BENCHMARK_SITES.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name} ({site.era})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Split View: Left = Visual Viewport & Grad-CAM, Right = Prediction Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Visual Viewport & Saliency Column (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative transition-all"
                >
                  {/* Viewport Header */}
                  <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-slate-300 truncate max-w-[200px] sm:max-w-xs">
                        {currentDisplay.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{currentDisplay.yearOrSource}</span>
                    </div>
                  </div>

                  {/* Main Image Stage */}
                  <div className="relative aspect-[4/3] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={currentDisplay.imageUrl}
                      alt={currentDisplay.title}
                      className="w-full h-full object-cover select-none"
                    />

                    {/* Grad-CAM Saliency Overlay */}
                    {showGradCam && (
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
                        style={{
                          background: getHeatmapGradient()
                        }}
                      />
                    )}

                    {/* Image Footer Details */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm text-slate-300 border border-slate-800">
                        {currentDisplay.creator}
                      </span>
                      {showGradCam && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-sm text-emerald-300 border border-emerald-800/80 font-mono">
                          Grad-CAM: High Activation
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Explainability Toolbar */}
                  <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={showGradCam}
                          onChange={(e) => setShowGradCam(e.target.checked)}
                          className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                        />
                        Grad-CAM Saliency
                      </label>

                      {showGradCam && (
                        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                          <span className="text-slate-400">Opacity:</span>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={camOpacity}
                            onChange={(e) => setCamOpacity(Number(e.target.value))}
                            className="w-20 accent-emerald-500 cursor-pointer"
                          />
                          <span className="font-mono text-emerald-400 w-7">{camOpacity}%</span>
                        </div>
                      )}
                    </div>

                    {showGradCam && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Palette:</span>
                        <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800">
                          <button
                            onClick={() => setColorMap("thermal")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                              colorMap === "thermal" ? "bg-red-500/20 text-red-300 font-semibold" : "text-slate-400"
                            }`}
                          >
                            Thermal
                          </button>
                          <button
                            onClick={() => setColorMap("amber")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                              colorMap === "amber" ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-slate-400"
                            }`}
                          >
                            Amber
                          </button>
                          <button
                            onClick={() => setColorMap("emerald")}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                              colorMap === "emerald" ? "bg-emerald-500/20 text-emerald-300 font-semibold" : "text-slate-400"
                            }`}
                          >
                            Emerald
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed px-1">
                  <strong className="text-emerald-400">Grad-CAM Explanation:</strong> Warm zones indicate spatial activations that contributed most strongly toward this class prediction.
                </p>
              </div>

              {/* Classification Results Column (5 cols) */}
              <div className="lg:col-span-5 space-y-4">

                {/* Primary Prediction Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden">
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400 block">
                    Predicted Architectural Era
                  </span>

                  <div className="flex items-baseline gap-3">
                    <h3
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        currentDisplay.era === "Mughal"
                          ? "text-emerald-400"
                          : currentDisplay.era === "Sikh"
                          ? "text-teal-400"
                          : currentDisplay.era === "British Colonial"
                          ? "text-red-400"
                          : "text-sky-400"
                      }`}
                    >
                      {currentDisplay.era}
                    </h3>
                    <span className="text-xl font-bold text-white font-mono">
                      {(currentDisplay.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Out of Distribution Alert if needed */}
                  {currentDisplay.isOod && (
                    <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-red-300 block font-semibold">Low Confidence:</strong>
                        {currentDisplay.oodReason || "Visual evidence does not strongly align with the four trained Pakistani heritage periods."}
                      </div>
                    </div>
                  )}
                </div>

                {/* Calibrated Probabilities Across All 4 Periods */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                    Probability Breakdown (4 Classes)
                  </h4>

                  <div className="space-y-2.5">
                    {(Object.entries(currentDisplay.probabilities) as [string, number][])
                      .sort((a, b) => b[1] - a[1])
                      .map(([periodName, prob]) => {
                        const pct = (prob * 100).toFixed(1);
                        const isTop = periodName === currentDisplay.era;
                        return (
                          <div key={periodName} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-semibold ${isTop ? "text-white" : "text-slate-400"}`}>
                                {periodName}
                              </span>
                              <span className={`font-mono font-bold ${isTop ? "text-emerald-400" : "text-slate-400"}`}>
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  periodName === "Mughal"
                                    ? "bg-emerald-500"
                                    : periodName === "Sikh"
                                    ? "bg-teal-400"
                                    : periodName === "British Colonial"
                                    ? "bg-red-500"
                                    : "bg-sky-400"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Architectural Evidence List */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Observed Architectural Features
                  </h4>

                  <div className="space-y-2">
                    {currentDisplay.diagnosticFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-200 block">{feat.feature}</strong>
                          <span className="text-[11px] text-slate-400 leading-relaxed">{feat.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: HISTORICAL CANONS & TIMELINE */}
        {/* ===================================================================== */}
        {activeTab === "canons" && (
          <HistoricalTimeline onSelectBenchmarkForTest={handleTimelineSelectBenchmark} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <BadshahiMosqueLogo className="w-4 h-4 opacity-70" />
        <span>Pakistani Architecture Classifier • Heritage Intelligence</span>
      </footer>
    </div>
  );
}

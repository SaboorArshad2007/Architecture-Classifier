import React, { useState, useMemo } from "react";
import {
  Calendar,
  Layers,
  Sparkles,
  Building2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  MapPin
} from "lucide-react";
import { TIMELINE_ERAS, ArchitecturalEraDetail } from "../data/timelineData.ts";
import { BENCHMARK_SITES, BenchmarkSite } from "../data/benchmarkData.ts";

interface HistoricalTimelineProps {
  onSelectBenchmarkForTest?: (site: BenchmarkSite) => void;
}

export const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({
  onSelectBenchmarkForTest
}) => {
  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const activeEra: ArchitecturalEraDetail = TIMELINE_ERAS[selectedEraIndex];

  // Derive unique categories for the active era's trivia
  const categories = useMemo(() => {
    if (!activeEra.trivia) return [];
    const set = new Set(activeEra.trivia.map((t) => t.category));
    return Array.from(set);
  }, [activeEra]);

  // Filter trivia items by selected category
  const filteredTrivia = useMemo(() => {
    if (!activeEra.trivia) return [];
    if (selectedCategory === "all") return activeEra.trivia;
    return activeEra.trivia.filter((t) => t.category === selectedCategory);
  }, [activeEra, selectedCategory]);

  const handleSelectEra = (index: number) => {
    setSelectedEraIndex(index);
    setSelectedCategory("all");
  };

  const handlePrevEra = () => {
    setSelectedEraIndex((prev) => (prev > 0 ? prev - 1 : TIMELINE_ERAS.length - 1));
    setSelectedCategory("all");
  };

  const handleNextEra = () => {
    setSelectedEraIndex((prev) => (prev + 1) % TIMELINE_ERAS.length);
    setSelectedCategory("all");
  };

  const handleTestInClassifier = () => {
    if (!onSelectBenchmarkForTest) return;
    const matchingSite = BENCHMARK_SITES.find(
      (s) => s.id === activeEra.benchmarkSiteId || s.era.toLowerCase().includes(activeEra.id)
    );
    if (matchingSite) {
      onSelectBenchmarkForTest(matchingSite);
    } else {
      onSelectBenchmarkForTest(BENCHMARK_SITES[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Era Navigation Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Architectural Eras of Pakistan
            </h2>
            <p className="text-xs text-slate-400">
              Click any era to see how building forms, materials, and structural styles evolved over five centuries.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono self-start sm:self-auto">
            Era {selectedEraIndex + 1} of {TIMELINE_ERAS.length}
          </span>
        </div>

        {/* 4 Interactive Era Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {TIMELINE_ERAS.map((era, index) => {
            const isSelected = index === selectedEraIndex;
            return (
              <button
                key={era.id}
                onClick={() => handleSelectEra(index)}
                className={`text-left p-3 sm:p-4 rounded-xl border transition-all relative flex flex-col justify-between min-h-[88px] ${
                  isSelected
                    ? "bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                    : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold font-mono transition-transform ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: era.color }}
                  />
                </div>
                <div>
                  <div
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {era.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {era.dates}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Era Detail Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Visual Exemplar & Heritage Sites (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
              <img
                src={activeEra.photoUrl}
                alt={activeEra.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-white font-semibold text-xs border border-slate-800">
                  {activeEra.name} Reference
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded">
                  {activeEra.photoAttribution}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Benchmark Monument</span>
                  <span className="text-[11px] text-slate-400">{activeEra.tagline}</span>
                </div>
                <button
                  onClick={handleTestInClassifier}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Test in Classifier
                </button>
              </div>
            </div>
          </div>

          {/* Key Heritage Sites in Pakistan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Prominent Monuments in Pakistan
            </h4>
            <div className="space-y-1.5">
              {activeEra.milestones.slice(0, 3).map((site, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs flex items-start justify-between gap-2"
                >
                  <div>
                    <strong className="text-white block">{site.siteName}</strong>
                    <span className="text-[11px] text-slate-400">{site.city} • {site.significance}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/90 shrink-0 mt-0.5">
                    {site.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Historical Overview, Evolution & Hallmarks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Era Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${activeEra.color}20`,
                  color: activeEra.color,
                  border: `1px solid ${activeEra.color}40`
                }}
              >
                {activeEra.name}
              </span>
              <span className="text-xs font-mono text-slate-400">{activeEra.dates}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeEra.summary}
            </p>

            {/* How Style Evolved */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Evolution & Stylistic Shift:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">Origin & Transition</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activeEra.evolutionaryShift.shiftFromPrevious}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">Structural Breakthrough</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activeEra.evolutionaryShift.structuralBreakthrough}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Architectural Hallmarks Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Defining Visual Hallmarks
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">Arches & Openings</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeEra.tectonicElements.arches.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">Domes & Rooflines</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeEra.tectonicElements.domesAndRoofing.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">Materials & Masonry</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeEra.tectonicElements.materialsAndMasonry.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">Ornament & Detailing</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {activeEra.tectonicElements.facadesAndOrnament.description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={handlePrevEra}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Era</span>
            </button>
            <button
              onClick={handleNextEra}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <span>Next Era</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: ARCHITECTURAL CURIOSITIES & LESSER-KNOWN TRIVIA */}
      {/* ===================================================================== */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: `${activeEra.color}15`,
                  color: activeEra.color,
                  borderColor: `${activeEra.color}35`
                }}
              >
                Curiosities & Architectural Lore
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {activeEra.trivia?.length || 0} Lesser-Known Discoveries
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              Architectural Secrets & Trivia: {activeEra.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Fascinating engineering feats, acoustic phenomena, climate adaptations, and secret artisanal recipes embedded in Pakistan&apos;s monuments.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                  : "bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
              }`}
            >
              All Secrets ({activeEra.trivia?.length || 0})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-sm"
                    : "bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Trivia Cards Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrivia.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all duration-200 hover:shadow-xl hover:shadow-black/50 group relative overflow-hidden"
            >
              {/* Subtle accent line on top of each card in era color */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: activeEra.color }}
              />

              <div className="space-y-3">
                {/* Meta Row: Category Badge + Monument Reference */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="px-2 py-0.5 rounded-md font-bold text-[10px] tracking-wide border uppercase"
                    style={{
                      backgroundColor: `${activeEra.color}15`,
                      color: activeEra.color,
                      borderColor: `${activeEra.color}35`
                    }}
                  >
                    {item.category}
                  </span>
                  <span
                    className="flex items-center gap-1 text-slate-400 text-[10px] truncate max-w-[55%] font-medium"
                    title={item.monumentReference}
                  >
                    <MapPin className="w-3 h-3 text-emerald-400/80 shrink-0" />
                    <span className="truncate">{item.monumentReference}</span>
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                  {item.title}
                </h4>

                {/* Fact Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.fact}
                </p>
              </div>

              {/* Significance / Deeper Context Box */}
              <div className="pt-3 border-t border-slate-800/80 bg-slate-900/70 -mx-1 -mb-1 p-3 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>Deeper Architectural Impact</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.significance}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

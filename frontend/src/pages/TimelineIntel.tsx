import React, { useEffect, useState } from 'react';
import { 
  History, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  ShieldAlert, 
  Flame, 
  ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';

export const TimelineIntel: React.FC = () => {
  const [windowDays, setWindowDays] = useState<number>(30);
  const [sliderDay, setSliderDay] = useState<number>(28);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [evolutionData, setEvolutionData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEvolution = (day: number) => {
    setLoading(true);
    api.getTimelineEvolution(windowDays, day)
      .then((data) => setEvolutionData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvolution(sliderDay);
  }, [sliderDay, windowDays]);

  // Auto-play interval
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSliderDay((prev) => {
          if (prev >= 35) {
            setIsPlaying(false);
            return 35;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const milestones = evolutionData?.milestones || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold uppercase flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-blue-600" />
            4D Temporal Graph Analytics
          </span>
          <span className="font-mono text-slate-500 font-semibold">Dynamic Snapshot Replay</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Timeline Intelligence & Network Evolution</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Observe how the criminal network expanded from fragmented localized extortion complaints into a high-density, multi-modal convergence. Drag the slider to replay network formation day by day.
        </p>
      </div>

      {/* Interactive Time Slider Controller */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          {/* Controls: Play/Pause, Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition shadow-xs"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Play Network Evolution'}</span>
            </button>
            <button
              onClick={() => { setIsPlaying(false); setSliderDay(1); }}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Reset to Day 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Current Date Display */}
          <div className="flex items-center gap-3 font-mono">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Simulation Day</span>
              <span className="text-xl font-black text-blue-600">Day {sliderDay} / 35</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold">
              {evolutionData?.current_date || '2026-08-28'}
            </div>
          </div>
        </div>

        {/* Slider Input */}
        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={35}
            value={sliderDay}
            onChange={(e) => setSliderDay(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1 font-semibold">
            <span>Aug 01 (Baseline)</span>
            <span>Aug 10</span>
            <span>Aug 18 (Initial Contact)</span>
            <span>Aug 24 (Meeting)</span>
            <span>Aug 28 (🚨 NET-017 Peak)</span>
            <span>Sep 04</span>
          </div>
        </div>

        {/* Metric Progression Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Active Graph Nodes</span>
            <span className="text-xl font-bold font-mono text-blue-600">
              {evolutionData?.active_nodes_count ?? 0} Entities
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Active Relationships</span>
            <span className="text-xl font-bold font-mono text-indigo-600">
              {evolutionData?.active_relationships_count ?? 0} Edges
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">FIRs Lodged (Cumulative)</span>
            <span className="text-xl font-bold font-mono text-red-600">
              {evolutionData?.recent_firs_count ?? 0} FIRs
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Transactions Logged</span>
            <span className="text-xl font-bold font-mono text-amber-700">
              {evolutionData?.recent_tx_count ?? 0} Ledgers
            </span>
          </div>
        </div>
      </div>

      {/* Significant Temporal Milestones along the Slider */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
          Critical Operational Milestones Reconstructed
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {milestones.map((m: any, idx: number) => {
            const isPassed = sliderDay >= m.day;
            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border transition ${
                  isPassed
                    ? m.category === 'alert'
                      ? 'bg-red-50 border-red-200 text-red-900 shadow-xs'
                      : 'bg-slate-50 border-blue-200 text-slate-800'
                    : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={`font-bold ${isPassed ? 'text-blue-700' : 'text-slate-500'}`}>
                    Day {m.day} • {m.date}
                  </span>
                  <span className="capitalize px-1.5 py-0.2 rounded bg-white border border-slate-200">
                    {m.category}
                  </span>
                </div>
                <p className="font-bold text-xs">{m.event}</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">{m.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ExternalLink, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  ShieldCheck, 
  Building2, 
  User, 
  Share2 
} from 'lucide-react';
import { api } from '../services/api';
import { OsintResult } from '../types';

export const OsintSearch: React.FC = () => {
  const [query, setQuery] = useState('Trident Global Logistics Vikram Malhotra JNPT port expansion');
  const [results, setResults] = useState<OsintResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMeta, setSearchMeta] = useState<any | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await api.searchOsint(query);
      setResults(data.results || []);
      setSearchMeta(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGraph = async (osintId: string) => {
    try {
      const res = await api.addOsintToGraph(osintId);
      if (res.success) {
        setAddedIds((prev) => ({ ...prev, [osintId]: true }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const quickQueries = [
    "Trident Global Logistics Vikram Malhotra JNPT port expansion",
    "Swift Horizons FinTech Advisory MCA corporate filing directors",
    "Tariq Ahmed shipping agent maritime license customs notice",
    "Aman Singhania Surat Bullion Bourse commercial litigation",
    "Northern Haulers Association truck strike protest Dhaula Kuan"
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold uppercase flex items-center gap-1.5 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            Open Source Intelligence (OSINT)
          </span>
          <span className="font-mono text-slate-500 font-semibold text-[11px]">Public-Web Verification Gateway</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Public-Web OSINT Search & Evidence Corroboration</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Queries publicly accessible web documents, corporate filings, gazette notices, and commercial directories. Automatically extracts entity mentions and creates unverified investigation leads.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter corporate entity, suspect name, vessel registry, or public keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl transition shadow-xs disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
          >
            <Globe className="w-4 h-4" />
            <span>{loading ? 'Searching OSINT...' : 'Execute Search'}</span>
          </button>
        </form>

        {/* Quick Queries Buttons */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Preset Demonstration Queries:</span>
          <div className="flex flex-wrap gap-2">
            {quickQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setQuery(q); }}
                className="px-3 py-1.5 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-700 text-[11px] transition text-left shadow-xs font-medium"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Metadata & Mode Indicator */}
      {searchMeta && (
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-3 font-semibold bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <span>Search Mode: <strong className="text-blue-700 uppercase">{searchMeta.mode}</strong></span>
          <span>Retrieved: {new Date(searchMeta.retrieved_at).toLocaleTimeString()}</span>
        </div>
      )}

      {/* Mandatory Ethics Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-amber-950 font-medium">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Legal Notice:</strong> Public-web records are designated as <strong>Public Source — Unverified</strong> until corroborated by a sworn investigator. Does not constitute judicial proof.
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((item) => {
          const isAdded = addedIds[item.id] || item.verification_status === 'needs_review';
          return (
            <div 
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3.5 hover:border-blue-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-600 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold">
                      {item.source_domain}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold uppercase">
                      Public Source — Unverified
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 pt-0.5 leading-snug">{item.title}</h3>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Relevance Score</span>
                  <span className="text-base font-black font-mono text-blue-700">{item.relevance_score}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                "{item.snippet}"
              </p>

              {/* Detected Entities */}
              {item.entities_found && item.entities_found.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                  <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">Entities Detected:</span>
                  {item.entities_found.map((ent, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold font-mono text-[10px]">
                      {ent}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions: View Source & Add to Investigation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1.5 font-mono font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Source Webpage</span>
                </a>

                <button
                  onClick={() => handleAddToGraph(item.id)}
                  disabled={isAdded}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isAdded
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 cursor-default shadow-xs'
                      : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added to Graph (Unverified Lead)</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add to Investigation Graph</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

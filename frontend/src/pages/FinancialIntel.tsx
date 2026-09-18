import React, { useEffect, useState } from 'react';
import { 
  Landmark, 
  RefreshCw, 
  ArrowRight, 
  AlertTriangle, 
  Repeat, 
  Zap, 
  Layers, 
  ShieldAlert, 
  Info, 
  TrendingDown, 
  Upload,
  Activity,
  CreditCard,
  Building2,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const FinancialIntel: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinancials = () => {
    setLoading(true);
    api.getFinancialOverview()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-mono text-xs space-y-2">
        <Activity className="w-6 h-6 animate-spin text-amber-600" />
        <span>Analyzing financial transactions & directed flow cycles...</span>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const patterns = data?.patterns || [];
  const transactions = data?.recent_transactions || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold uppercase flex items-center gap-1.5 text-[11px]">
              <Landmark className="w-3.5 h-3.5 text-amber-600" />
              Financial Intelligence Unit (FIU) Module
            </span>
            <span className="font-mono text-slate-500 font-semibold text-[11px]">PMLA Layering & Wash-Trade Graph</span>
          </div>
          <button
            onClick={fetchFinancials}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-xs transition hover:border-slate-300"
            title="Refresh Analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Network & Suspicious Money Trails</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Tracks velocity of capital transfers across shell entities and mule accounts. Automatically detects cyclic wash loops, rapid pass-through structuring, and multi-tier laundering channels.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Monitored Accounts</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-blue-700">{metrics.total_monitored_accounts ?? 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Flagged Mules / Shells</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-red-700">{metrics.flagged_accounts_count ?? 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Analyzed Transfers</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{metrics.total_transactions_analyzed ?? 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Suspicious Volume</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-amber-700">₹{((metrics.suspicious_flow_volume ?? 0) / 100000).toFixed(1)} Lakh</p>
        </div>
      </div>

      {/* Empty State */}
      {patterns.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto shadow-xs">
            <Landmark className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Suspicious Financial Patterns Flagged</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              No circular laundering loops or high-velocity structuring anomalies detected in the current ledger. Import bank statements or transaction spreadsheets to trigger algorithmic PMLA cycle detection.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Upload className="w-4 h-4" />
              <span>Import Bank Ledger CSV</span>
            </button>
            <button
              onClick={async () => {
                await api.setMode('mock');
                window.location.reload();
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition"
            >
              Switch to Demo Mode
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
            Detected Algorithmic Financial Patterns
          </h2>

          {patterns.map((pat: any) => (
            <div 
              key={pat.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 uppercase">
                      {pat.pattern_type}
                    </span>
                    <span className="text-xs font-mono text-red-700 uppercase font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Severity: {pat.severity}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{pat.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Total Pattern Flow</span>
                  <span className="text-xl font-black font-mono text-amber-700">{pat.total_amount_involved}</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                {pat.description}
              </p>

              {/* Hop Sequence / Cycle Trail */}
              {pat.nodes_involved && (
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2.5">
                  <span className="text-[10px] font-mono uppercase text-slate-600 font-bold block">
                    Cycle Pathway ({pat.nodes_involved.length} Entities Involved):
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    {pat.nodes_involved.map((node: string, idx: number) => (
                      <React.Fragment key={idx}>
                        <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold shadow-xs">
                          {node}
                        </span>
                        {idx < pat.nodes_involved.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

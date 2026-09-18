import React, { useEffect, useState } from 'react';
import { EyeOff, ArrowRight, ShieldAlert, Users, MapPin, Landmark, Clock, CheckCircle2, Info, Upload, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { HiddenConnection } from '../types';

export const HiddenConnections: React.FC = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<HiddenConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHiddenConnections()
      .then((data) => setConnections(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-mono text-xs space-y-2">
        <Activity className="w-6 h-6 animate-spin text-purple-600" />
        <span>Running Jaccard & Adamic-Adar link prediction across active graph...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono font-bold uppercase flex items-center gap-1.5 text-[11px]">
            <EyeOff className="w-3.5 h-3.5 text-purple-600" />
            Graph Link Prediction
          </span>
          <span className="font-mono text-slate-500 font-semibold text-[11px]">Adamic-Adar & Jaccard Triadic Closure</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Potential Hidden Criminal Relationships</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Surfacing latent, non-obvious relationships between entities who have zero direct call or meeting records, but exhibit significant structural commonality through shared associates, temporal-spatial overlap, and intermediary fund routing.
        </p>
      </div>

      {/* Empty State */}
      {connections.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mx-auto shadow-xs">
            <EyeOff className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Hidden Connections Flagged</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              When entities share multiple common associates, colocation venues, or financial intermediary hops without direct communication edges, our link prediction algorithm detects latent relationships here.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/network')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition shadow-xs"
            >
              Open Network Explorer
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
          {connections.map((item) => (
            <div 
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-5"
            >
              {/* Top Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200">
                      {item.code}
                    </span>
                    <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase font-bold">
                      Severity: {item.severity}
                    </span>
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900 leading-snug">{item.title}</h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Link Probability</span>
                  <span className="text-2xl font-black font-mono text-purple-700">{item.confidence}%</span>
                </div>
              </div>

              {/* Entity A <-> Entity B Visual Connector */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                <div className="md:col-span-3 p-4 rounded-xl bg-blue-50/40 border border-blue-200 text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-mono text-blue-700 font-bold block uppercase">{item.entity_a.code}</span>
                  <p className="text-sm font-bold text-slate-900">{item.entity_a.name}</p>
                  <p className="text-[11px] text-slate-500">{item.entity_a.role}</p>
                </div>

                <div className="md:col-span-1 flex flex-col items-center justify-center text-purple-700 font-mono text-xs font-bold py-2">
                  <span className="animate-pulse tracking-wider">LATENT</span>
                  <div className="w-full border-t-2 border-dashed border-purple-300 my-1.5" />
                  <span className="text-[10px] text-slate-400 font-semibold">0 Direct Calls</span>
                </div>

                <div className="md:col-span-3 p-4 rounded-xl bg-amber-50/40 border border-amber-200 text-center space-y-1 shadow-xs">
                  <span className="text-[10px] font-mono text-amber-700 font-bold block uppercase">{item.entity_b.code}</span>
                  <p className="text-sm font-bold text-slate-900">{item.entity_b.name}</p>
                  <p className="text-[11px] text-slate-500">{item.entity_b.role}</p>
                </div>
              </div>

              {/* Explanation Factor Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mutual Associates */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold font-mono text-[11px]">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Shared Associates ({item.common_neighbors?.length || 0})</span>
                  </div>
                  <div className="space-y-1">
                    {item.common_neighbors?.map((n) => (
                      <div key={n.code} className="flex items-center justify-between text-[11px] text-slate-700 py-1 px-2 rounded-lg bg-white border border-slate-200/80">
                        <span className="font-semibold text-slate-900">{n.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{n.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Locations */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 text-purple-700 font-bold font-mono text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    <span>Shared Locations ({item.shared_locations?.length || 0})</span>
                  </div>
                  <div className="space-y-1">
                    {item.shared_locations?.map((loc) => (
                      <div key={loc.code} className="flex items-center justify-between text-[11px] text-slate-700 py-1 px-2 rounded-lg bg-white border border-slate-200/80">
                        <span className="font-semibold text-slate-900 truncate">{loc.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{loc.city}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intermediary Financial Hops */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold font-mono text-[11px]">
                    <Landmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>Layered Money Trail</span>
                  </div>
                  <div className="space-y-1 text-[10px] font-mono">
                    {item.intermediary_transactions?.map((tx, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 space-y-0.5">
                        <div className="flex items-center justify-between text-slate-800">
                          <span className="font-semibold">{tx.from_account}</span>
                          <span className="text-amber-700 font-extrabold">{tx.amount}</span>
                        </div>
                        <p className="text-slate-500 text-[9px]">↳ Wired to {tx.to_account}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mandatory Ethics / Human Verification Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 text-amber-950 font-medium">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{item.verification_notice}</span>
                </div>
                <span className="text-[10px] font-mono text-amber-800 uppercase font-bold bg-white px-2 py-0.5 rounded border border-amber-200">
                  Corroboration Required
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

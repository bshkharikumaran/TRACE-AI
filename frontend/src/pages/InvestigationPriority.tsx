import React, { useEffect, useState } from 'react';
import { 
  ListOrdered, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Award, 
  Layers, 
  TrendingUp, 
  UserCheck,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { PriorityLead } from '../types';

export const InvestigationPriority: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<PriorityLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPriorityLeads()
      .then((data) => setLeads(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 font-mono text-xs">
        Computing multi-factor network centrality and lead priority scores...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-bold uppercase flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
            Operational Prioritization Engine
          </span>
          <span className="font-mono text-slate-500 font-semibold">Multi-Factor Analytical Ranking</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Investigation Lead Priority Ranking</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Ranks suspect leads by structural network centrality, recent activity surge, multi-modal cross-community bridging, and telecommunication density to optimize law enforcement resource allocation.
        </p>
      </div>

      {/* Mandatory Ethics Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-amber-900 font-medium">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Procedural Guideline:</strong> This metric is strictly designated as an <strong>Investigation Lead Priority</strong> score to guide resource dispatch and warrant drafting. It does <strong>NOT</strong> represent a criminal score or judicial determination of guilt.
          </span>
        </div>
      </div>

      {/* Empty State */}
      {leads.length === 0 ? (
        <div className="p-10 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
            <ListOrdered className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Prioritized Leads Registered</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              When suspects and relationship edges are registered, our multi-factor centrality algorithm computes PageRank, betweenness, and connectivity to rank actionable leads.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/network')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-xs transition"
            >
              Add Suspects in Explorer
            </button>
            <button
              onClick={async () => {
                await api.setMode('mock');
                window.location.reload();
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-semibold text-xs transition"
            >
              Switch to Demo Mode
            </button>
          </div>
        </div>
      ) : (
        /* Ranked Leads List */
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.rank}
              className={`p-5 rounded-xl bg-white border ${
                lead.rank === 1 ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200'
              } shadow-sm space-y-3 hover:border-blue-400 transition`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-black text-sm ${
                    lead.rank === 1 ? 'bg-blue-600 text-white shadow-xs' :
                    lead.rank === 2 ? 'bg-slate-700 text-white' :
                    lead.rank === 3 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{lead.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{lead.name}</h3>
                      <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-slate-50 border border-slate-200 text-blue-700">
                        {lead.person_code}
                      </span>
                      {lead.alias && (
                        <span className="text-[11px] text-amber-700 font-medium">"{lead.alias}"</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{lead.occupation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Lead Priority Score</span>
                    <span className="text-xl font-black text-blue-600">{lead.investigation_lead_priority}/100</span>
                  </div>
                  <button
                    onClick={() => navigate(`/network?search=${lead.person_code}`)}
                    className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Inspect Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Centrality Factors & Why Ranked */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 text-center font-mono">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block uppercase font-semibold">Active Connections</span>
                  <span className="text-sm font-bold text-slate-800">{lead.degree_connections ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block uppercase font-semibold">Betweenness Centrality</span>
                  <span className="text-sm font-bold text-blue-700">{lead.betweenness_score ?? '0.000'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block uppercase font-semibold">Sub-Communities</span>
                  <span className="text-sm font-bold text-purple-700">{lead.communities_bridged ?? 1}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block uppercase font-semibold">Temporal Velocity</span>
                  <span className="text-sm font-bold text-red-700">{lead.recent_activity_acceleration || '0%'}</span>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong>Why Prioritized:</strong> {lead.why_prioritized}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

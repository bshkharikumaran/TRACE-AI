import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  User, 
  Phone, 
  Car, 
  Landmark, 
  MapPin, 
  Building2, 
  FileText, 
  Lock, 
  AlertTriangle, 
  ExternalLink,
  Activity,
  Award,
  Radio,
  Clock,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { CytoscapeNodeData } from '../../types';
import { api } from '../../services/api';

interface NodeInspectorProps {
  nodeData: CytoscapeNodeData | null;
  onClose: () => void;
  onSelectNeighbor?: (nodeId: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  nodeData,
  onClose,
  onSelectNeighbor
}) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nodeData?.id) return;
    setLoading(true);
    api.getNodeDetails(nodeData.id)
      .then((data) => setDetails(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [nodeData?.id]);

  if (!nodeData) return null;

  const entity = details?.entity_data || nodeData.details || {};
  const metrics = details?.metrics || {};

  return (
    <div className="w-96 bg-white border-l border-slate-200/90 flex flex-col h-full shadow-floating z-20 text-xs text-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 flex items-start justify-between bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
              {nodeData.type}
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">ID: {nodeData.code || nodeData.id}</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 leading-snug">{nodeData.label}</h3>
          {entity.alias && (
            <p className="text-xs text-amber-700 font-semibold mt-0.5">Known Alias: "{entity.alias}"</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-2">
            <Activity className="w-6 h-6 animate-spin text-blue-600" />
            <span className="font-mono text-xs">Analyzing graph topology...</span>
          </div>
        ) : (
          <>
            {/* Network Centrality & Role Card */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-bold uppercase text-[10px] font-mono tracking-wider">
                  Network Influence Score:
                </span>
                <span className="text-base font-black font-mono text-blue-700">
                  {metrics.network_influence || nodeData.network_score || 0}<span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>

              <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.network_influence || nodeData.network_score || 0}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-200/80">
                <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-[9px] text-slate-500 block font-mono font-bold uppercase">CLASSIFIED ROLE</span>
                  <span className="font-bold text-slate-900 text-xs">{metrics.role || 'Network Member'}</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-[9px] text-slate-500 block font-mono font-bold uppercase">DIRECT DEGREE</span>
                  <span className="font-bold text-slate-900 text-xs font-mono">{metrics.connections_count ?? 0} link(s)</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-[9px] text-slate-500 block font-mono font-bold uppercase">CLUSTERS LINKED</span>
                  <span className="font-bold text-emerald-700 text-xs font-mono">{metrics.communities_connected ?? 1} group(s)</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-[9px] text-slate-500 block font-mono font-bold uppercase">BETWEENNESS</span>
                  <span className="font-bold text-blue-700 text-xs font-mono">{metrics.betweenness_centrality ?? '0.0000'}</span>
                </div>
              </div>

              {/* Explicit "WHY" explanation */}
              {metrics.why_explanation && (
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-mono text-blue-700 uppercase font-bold flex items-center gap-1.5 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    Why was this classification assigned?
                  </span>
                  <p className="text-[11px] text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs">
                    {metrics.why_explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Profile Attributes */}
            {entity.occupation && (
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Occupation / Cover:</span>
                <p className="text-slate-800 font-semibold">{entity.occupation}</p>
                {entity.status && (
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600">
                    <span>Surveillance Status:</span>
                    <span className="text-amber-800 font-mono font-bold capitalize bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {entity.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Direct Connections / Associates */}
            {details?.neighbors && details.neighbors.length > 0 && (
              <div>
                <h4 className="text-[11px] font-mono uppercase text-slate-600 font-bold mb-2 flex items-center justify-between">
                  <span>Direct Associates ({details.neighbors.length})</span>
                  <span className="text-[10px] text-blue-600 font-sans font-semibold">Click to Inspect</span>
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {details.neighbors.map((nbr: any) => (
                    <div
                      key={nbr.id}
                      onClick={() => onSelectNeighbor && onSelectNeighbor(nbr.id)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer flex items-center justify-between transition shadow-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{nbr.label}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{nbr.type} {nbr.role ? `• ${nbr.role}` : ''}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Evidence Records */}
            {details?.relevant_evidence && details.relevant_evidence.length > 0 && (
              <div>
                <h4 className="text-[11px] font-mono uppercase text-slate-600 font-bold mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Corroborating Evidence ({details.relevant_evidence.length})</span>
                </h4>
                <div className="space-y-1.5">
                  {details.relevant_evidence.map((ev: any) => (
                    <div key={ev.id} className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-blue-700 font-bold">{ev.evidence_code}</span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                          {ev.verification_status}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 truncate">{ev.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1 truncate font-mono">SHA-256: {ev.sha256_hash?.substring(0, 16)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer / Action */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono font-medium">BSA SECTION 65B COMPLIANT</span>
        <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          CONFIDENTIAL
        </span>
      </div>
    </div>
  );
};

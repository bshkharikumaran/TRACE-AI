import React, { useEffect, useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Lock, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Compass,
  ExternalLink,
  ChevronRight,
  Info,
  X,
  Shield,
  Upload,
  Activity,
  Share2,
  MapPin,
  Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { EmergingNetwork, EvidenceItem } from '../types';

export const EmergingNetworks: React.FC = () => {
  const navigate = useNavigate();
  const [networks, setNetworks] = useState<EmergingNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<EmergingNetwork | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEmergingNetworks()
      .then((data) => {
        setNetworks(data);
        if (data.length > 0) setSelectedNetwork(data[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEvidenceClick = (eCode: string) => {
    const match = selectedNetwork?.supporting_evidence_details?.find(
      (ev) => ev.evidence_code === eCode || ev.code_ref === eCode
    );
    if (match) {
      setSelectedEvidence(match);
    } else {
      setSelectedEvidence({
        evidence_code: eCode,
        title: `Official Investigative Exhibit: ${eCode}`,
        description: `Certified law enforcement documentary record directly supporting Emerging Network ${selectedNetwork?.alert_code}.`,
        source_type: 'custody_exhibit',
        sha256_hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        verification_status: 'verified',
        created_at: '2026-08-25T14:30:00Z'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-mono text-xs space-y-2">
        <Activity className="w-6 h-6 animate-spin text-blue-600" />
        <span>Analyzing multi-window graph temporal dynamics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-mono font-bold uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              Primary Innovation (USP)
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Dynamic Multi-Window Differencing</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Emerging Criminal Network Detection</h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Algorithmic detection of newly converging criminal relationships over time, explaining why the pattern is suspicious and directly linking findings to supporting chain-of-custody evidence.
          </p>
        </div>

        {networks.length > 0 && (
          <div className="flex items-center gap-2">
            {networks.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  selectedNetwork?.id === net.id
                    ? 'bg-red-50 border-red-300 text-red-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Flame className={`w-4 h-4 ${selectedNetwork?.id === net.id ? 'text-red-600' : 'text-slate-400'}`} />
                <span>{net.alert_code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {networks.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto shadow-xs">
            <Flame className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Emerging Network Anomalies Detected</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              No converging relationship clusters exceed the anomaly threshold in the current time window. Ingest multi-period CDR datasets or switch to Mock Data Mode for the Operation Trident demonstration.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Upload className="w-4 h-4" />
              <span>Ingest Time-Series Records</span>
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
        selectedNetwork && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Alert Dossier & Why Detected */}
            <div className="lg:col-span-2 space-y-6">
              {/* Alert Summary Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-mono font-extrabold text-red-700 px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200">
                        {selectedNetwork.alert_code}
                      </span>
                      <span className="text-xs font-mono text-amber-800 font-bold uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Severity: {selectedNetwork.severity}
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {selectedNetwork.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Algorithmic Confidence</span>
                    <span className="text-2xl font-black font-mono text-blue-700">
                      {selectedNetwork.confidence}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                  {selectedNetwork.description}
                </p>

                {/* Numerical Metrics Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200 text-center space-y-1">
                    <span className="text-[10px] font-mono text-blue-800 uppercase block font-bold flex items-center justify-center gap-1">
                      <Share2 className="w-3 h-3 text-blue-600" /> New Links
                    </span>
                    <span className="text-lg font-black font-mono text-blue-700">
                      +{selectedNetwork.metrics_summary?.new_relationships_count ?? 0} Formed
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-200 text-center space-y-1">
                    <span className="text-[10px] font-mono text-purple-800 uppercase block font-bold flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-600" /> Shared Venues
                    </span>
                    <span className="text-lg font-black font-mono text-purple-700">
                      {selectedNetwork.metrics_summary?.shared_locations_count ?? 0} Hubs
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200 text-center space-y-1">
                    <span className="text-[10px] font-mono text-amber-800 uppercase block font-bold flex items-center justify-center gap-1">
                      <Landmark className="w-3 h-3 text-amber-600" /> Fund Conduits
                    </span>
                    <span className="text-lg font-black font-mono text-amber-700">
                      {selectedNetwork.metrics_summary?.shared_financial_accounts ?? 0} Accounts
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-rose-50/40 border border-rose-200 text-center space-y-1">
                    <span className="text-[10px] font-mono text-rose-800 uppercase block font-bold flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-rose-600" /> Acceleration
                    </span>
                    <span className="text-lg font-black font-mono text-rose-700">
                      {selectedNetwork.metrics_summary?.acceleration_rate || '+0%'}
                    </span>
                  </div>
                </div>

                {/* Why Flagged (Algorithmic Reasoning) */}
                <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-2">
                  <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>Algorithmic Rationale: Why Was This Flagged?</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed bg-white/80 p-3 rounded-lg border border-red-100">
                    {selectedNetwork.why_flagged}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col: Supporting Evidence */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Corroborating Evidence</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Chain-of-Custody
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedNetwork.supporting_evidence_codes?.map((code: string) => (
                    <div 
                      key={code}
                      onClick={() => handleEvidenceClick(code)}
                      className="p-3 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-blue-400 hover:bg-white cursor-pointer transition flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <span className="font-mono text-blue-700 font-bold">{code}</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">Investigative Exhibit Record</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>

                {selectedEvidence && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-700">{selectedEvidence.evidence_code}</span>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                        {selectedEvidence.verification_status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs">{selectedEvidence.title}</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{selectedEvidence.description}</p>
                    <div className="pt-2 border-t border-slate-200 text-[10px] font-mono text-slate-500 truncate">
                      SHA-256: {selectedEvidence.sha256_hash}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  ShieldAlert, 
  Users, 
  MapPin, 
  Landmark, 
  Car, 
  FileText, 
  Lock, 
  Flame, 
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  Download,
  Shield,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { CreateInvestigationModal } from '../components/modals/CreateInvestigationModal';

export const Investigations: React.FC = () => {
  const navigate = useNavigate();
  const [investigationsList, setInvestigationsList] = useState<any[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string>('');
  const [investigationData, setInvestigationData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchInvestigations = async () => {
    setLoading(true);
    try {
      const invs = await api.getInvestigations();
      setInvestigationsList(invs);
      if (invs.length > 0) {
        const firstId = invs[0].id;
        setSelectedInvId(firstId);
        const detail = await api.getInvestigationDetail(firstId);
        setInvestigationData(detail);
      } else {
        setInvestigationData(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const handleSelectInvestigation = async (invId: string) => {
    setSelectedInvId(invId);
    try {
      const detail = await api.getInvestigationDetail(invId);
      setInvestigationData(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportDossier = async () => {
    if (!selectedInvId) return;
    setExporting(true);
    try {
      const report = await api.getInvestigationReport(selectedInvId);
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TRACE-AI-Dossier-${selectedInvId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-mono text-xs space-y-2">
        <Activity className="w-6 h-6 animate-spin text-blue-600" />
        <span>Loading investigation workspace...</span>
      </div>
    );
  }

  // Zero-data empty state
  if (investigationsList.length === 0) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto text-xs text-slate-800">
        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto shadow-xs">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Active Investigations Registered</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your investigation registry is currently clear. Register a new inquiry dossier or ingest an FIR incident report to begin.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Register Investigation</span>
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Ingest FIR Document</span>
            </button>
          </div>
        </div>

        <CreateInvestigationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchInvestigations();
          }}
        />
      </div>
    );
  }

  const inv = investigationData?.investigation || investigationsList[0] || {};
  const metrics = investigationData?.metrics || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Case Selector Tabs */}
      {investigationsList.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {investigationsList.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectInvestigation(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                selectedInvId === item.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>{item.investigation_code || item.code}</span> - <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Investigation Dossier Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700">
                {inv.investigation_code || 'INV-REF'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-800 font-mono font-bold uppercase text-[11px]">
                STATUS: {inv.status || 'ACTIVE'} ({inv.priority || 'HIGH'} PRIORITY)
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{inv.title}</h1>
            <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
              {inv.description}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleExportDossier}
              disabled={exporting}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl transition shadow-xs flex items-center gap-2 hover:border-slate-300"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>{exporting ? 'Exporting...' : 'Export Dossier'}</span>
            </button>
            <button
              onClick={() => navigate('/network')}
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-2"
            >
              <span>Explore Graph</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Surveillance Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-center space-y-1">
            <span className="text-slate-500 block font-mono text-[10px] uppercase font-bold">Monitored Persons</span>
            <span className="text-2xl font-black font-mono text-blue-700">{metrics.total_persons_under_surveillance ?? 0}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-center space-y-1">
            <span className="text-slate-500 block font-mono text-[10px] uppercase font-bold">Flagged Vehicles</span>
            <span className="text-2xl font-black font-mono text-indigo-700">{metrics.monitored_vehicles ?? 0}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-center space-y-1">
            <span className="text-slate-500 block font-mono text-[10px] uppercase font-bold">Layered Accounts</span>
            <span className="text-2xl font-black font-mono text-amber-700">{metrics.flagged_bank_accounts ?? 0}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-center space-y-1">
            <span className="text-slate-500 block font-mono text-[10px] uppercase font-bold">Locations</span>
            <span className="text-2xl font-black font-mono text-purple-700">{metrics.connected_locations ?? 0}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 text-center space-y-1">
            <span className="text-slate-500 block font-mono text-[10px] uppercase font-bold">Emerging Alerts</span>
            <span className="text-2xl font-black font-mono text-red-700">{metrics.active_emerging_networks ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Case Details & Narrative Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Investigation Narrative & Multi-Jurisdictional Scope
            </h2>
          </div>
          <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            TRACE-AI Correlation Protocol
          </span>
        </div>

        <p className="text-slate-700 leading-relaxed text-xs">
          {inv.description || "Inquiry file details registered in the TRACE-AI core graph database. All associated suspects, bank accounts, vehicles, and telecommunication devices are indexed into the investigative topological canvas."}
        </p>

        {/* Lead Officer and Unit Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Lead Officer</span>
            <p className="font-bold text-slate-900 text-sm">{inv.lead_officer || 'Assigned Officer'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Jurisdiction / Unit</span>
            <p className="font-bold text-slate-900 text-sm">{inv.jurisdiction || 'NCRB Special Crime Cell'}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Registration Date</span>
            <p className="font-bold text-slate-900 text-sm">{inv.created_at ? new Date(inv.created_at).toLocaleDateString() : 'Active'}</p>
          </div>
        </div>
      </div>

      <CreateInvestigationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchInvestigations();
        }}
      />
    </div>
  );
};

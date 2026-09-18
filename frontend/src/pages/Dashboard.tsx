import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Share2, 
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpRight, 
  FileText,
  ExternalLink,
  ChevronRight,
  Plus,
  FlaskConical,
  Shield,
  Upload,
  Info,
  Sparkles,
  Table,
  CheckCircle2,
  TrendingUp,
  Activity,
  Award,
  RotateCcw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';
import { DataImportModal } from '../components/modals/DataImportModal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<'mock' | 'original'>('original');
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<any | null>(null);
  const [emergingAlerts, setEmergingAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const reloadData = () => {
    setLoading(true);
    Promise.all([
      api.getMode(),
      api.getInvestigations(),
      api.getNetworkMetrics(),
      api.getEmergingNetworks()
    ]).then(([modeRes, invs, netMetrics, alerts]) => {
      setCurrentMode(modeRes.mode);
      setInvestigations(invs);
      setNetworkMetrics(netMetrics);
      setEmergingAlerts(alerts);
    }).catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleSeedOriginal = async () => {
    setSeeding(true);
    try {
      await api.seedOriginal();
      reloadData();
    } catch (err) {
      console.error('Failed to seed demo data:', err);
    } finally {
      setSeeding(false);
    }
  };

  const handleResetOriginal = async () => {
    if (!window.confirm('Reset this workspace to a clean state? All entities and relationships in this session will be cleared.')) return;
    setLoading(true);
    try {
      await api.resetOriginal();
      reloadData();
    } catch (err) {
      console.error('Failed to reset workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalNodes = networkMetrics?.total_nodes || 0;
  const totalEdges = networkMetrics?.total_edges || 0;

  // Growth data for mock mode
  const mockGrowthData = [
    { week: 'Week 1', nodes: 28, relationships: 42 },
    { week: 'Week 2', nodes: 54, relationships: 98 },
    { week: 'Week 3', nodes: 86, relationships: 184 },
    { week: 'Week 4', nodes: 135, relationships: 320 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 shadow-card transition-all">
        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-50/40 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                TRACE-AI Intelligence Hub
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border ${
                currentMode === 'original' 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'bg-purple-50 border-purple-300 text-purple-800'
              }`}>
                {currentMode === 'original' ? '● Original / Live Mode' : '● Demo / Mock Mode'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              Threat Relationship Analysis & Crime Exploration
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assisting law enforcement investigators by connecting fragmented crime records, uncovering emerging relationships over time, and prioritizing high-confidence leads under Indian legal frameworks.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {currentMode === 'original' ? (
              <>
                <button
                  onClick={handleSeedOriginal}
                  disabled={seeding}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold transition flex items-center gap-2 shadow-xs"
                  title="Load Operation Falcon demonstration dataset (8 entities, 8 edges)"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{seeding ? 'Seeding...' : 'Seed Demo Case'}</span>
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold transition flex items-center gap-2 shadow-xs hover:border-slate-300"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>Import CSV</span>
                </button>
                <button
                  onClick={() => navigate('/documents')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold transition flex items-center gap-2 shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ingest Case Report</span>
                </button>
                {(totalNodes > 0 || investigations.length > 0) && (
                  <button
                    onClick={handleResetOriginal}
                    className="p-2 rounded-xl bg-white hover:bg-red-50 border border-slate-200 text-slate-500 hover:text-red-600 shadow-xs transition"
                    title="Reset Workspace to Clean State"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate('/emerging')}
                className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100/80 text-red-700 font-bold transition flex items-center gap-2 shadow-xs"
              >
                <Flame className="w-4 h-4 text-red-600 animate-pulse" />
                <span>Review NET-017 Alert</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* When in Original Mode and no data yet: Warm Onboarding Workflow Guide */}
      {currentMode === 'original' && investigations.length === 0 && totalNodes === 0 && (
        <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Your Live Investigation Workspace is Ready</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              You are in <strong>Original Data Mode</strong>. The database is empty with zero synthetic records. Follow the recommended 4-step workflow to register cases or import verified records:
            </p>
          </div>

          {/* Quick-Start Banner for Demonstrations */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">One-Click Demonstration Seed (Operation Falcon)</h3>
                <p className="text-[11px] text-slate-600">Populates 8 connected entities (mastermind, hawala mule, phones, bank accounts) with active relationships and digital evidence exhibit for immediate evaluation.</p>
              </div>
            </div>
            <button
              onClick={handleSeedOriginal}
              disabled={seeding}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>{seeding ? 'Seeding...' : 'Seed Demonstration Investigation'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate('/documents')}
              className="p-5 rounded-xl bg-slate-50/60 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all space-y-2.5 group shadow-xs hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold font-mono text-xs">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Ingest Case Reports</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Upload FIR copies, incident transcripts, or CDR dumps. TRACE-AI automatically extracts persons, phones, and vehicles.
              </p>
            </div>

            <div 
              onClick={() => navigate('/network')}
              className="p-5 rounded-xl bg-slate-50/60 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all space-y-2.5 group shadow-xs hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center font-bold font-mono text-xs">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Register Entities</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Click "+ Add Entity" to register persons of interest, vehicles, or bank accounts and connect them with relationship edges.
              </p>
            </div>

            <div 
              onClick={() => setShowImportModal(true)}
              className="p-5 rounded-xl bg-slate-50/60 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 cursor-pointer transition-all space-y-2.5 group shadow-xs hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold font-mono text-xs">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Import CSV Dumps</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Upload CSV spreadsheets with CDR logs, banking transactions, or suspect registries with auto-column mapping.
              </p>
            </div>

            <div 
              onClick={async () => {
                await api.setMode('mock');
                window.location.reload();
              }}
              className="p-5 rounded-xl bg-slate-50/60 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/20 cursor-pointer transition-all space-y-2.5 group shadow-xs hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100/70 text-purple-700 flex items-center justify-center font-bold font-mono text-xs">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Explore Demo Mode</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Switch to <strong>Mock Data Mode</strong> to explore the full pre-seeded 105-entity scenario for training or demonstrations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Monitored Entities */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
              Monitored Entities
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-mono text-slate-900 tracking-tight">{totalNodes}</p>
            <p className="text-[11px] text-blue-700 font-medium mt-1 flex items-center gap-1">
              <span>● Real-time active nodes</span>
            </p>
          </div>
        </div>

        {/* Card 2: Relationship Edges */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
              Relationship Edges
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-mono text-indigo-700 tracking-tight">{totalEdges}</p>
            <p className="text-[11px] text-indigo-700 font-medium mt-1 flex items-center gap-1">
              <span>● Calls, finances, meetings</span>
            </p>
          </div>
        </div>

        {/* Card 3: Active Cases */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
              Active Cases
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-mono text-emerald-700 tracking-tight">{investigations.length}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span>● Formal inquiry dossiers</span>
            </p>
          </div>
        </div>

        {/* Card 4: Emerging Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold tracking-wider">
              Emerging Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-xs">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black font-mono text-rose-700 tracking-tight">{emergingAlerts.length}</p>
            <p className="text-[11px] text-rose-700 font-medium mt-1 flex items-center gap-1">
              <span>● Dynamic velocity flags</span>
            </p>
          </div>
        </div>
      </div>

      {/* Active Investigations Section */}
      {investigations.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                Active Investigation Dossiers ({investigations.length})
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                Section 157 Cr.P.C.
              </span>
            </div>
            <button
              onClick={() => navigate('/investigations')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold transition"
            >
              <span>View All Cases</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investigations.map((inv) => (
              <div 
                key={inv.id}
                onClick={() => navigate('/investigations')}
                className="p-5 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:border-blue-400 hover:bg-white cursor-pointer transition-all space-y-2.5 shadow-xs hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {inv.investigation_code}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                    {inv.priority} PRIORITY
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{inv.title}</h3>
                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{inv.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Network Evolution Chart (Mock Mode Spotlight) */}
      {currentMode === 'mock' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Temporal Network Acceleration (Operation Trident)</h2>
              <p className="text-xs text-slate-500">Comparing relationship formation velocities over 4-week observation window</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-mono text-blue-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              +73% ACCELERATION DETECTED
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockGrowthData}>
                <defs>
                  <linearGradient id="colorRels" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="relationships" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRels)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Modals */}
      <DataImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </div>
  );
};

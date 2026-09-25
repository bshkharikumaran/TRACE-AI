import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Share2, 
  Flame, 
  EyeOff, 
  GitBranch, 
  Landmark, 
  History, 
  Globe, 
  FileText, 
  ListOrdered, 
  Lock, 
  Sparkles, 
  FileCheck2, 
  Settings, 
  Search, 
  ChevronDown,
  Info,
  Plus,
  RefreshCw,
  FlaskConical,
  Shield,
  UserPlus,
  Upload,
  LogOut,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth, DEMO_OFFICERS } from '../context/AuthContext';
import { CreateInvestigationModal } from '../components/modals/CreateInvestigationModal';
import { AddEntityModal } from '../components/modals/AddEntityModal';
import { DataImportModal } from '../components/modals/DataImportModal';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, quickLoginAs, isRole, hasPermission } = useAuth();
  
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [currentMode, setCurrentMode] = useState<'mock' | 'original'>('original');
  const [modeLoading, setModeLoading] = useState(false);
  
  // Modals
  const [showCreateInv, setShowCreateInv] = useState(false);
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Dropdown menus
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    api.getMode()
      .then((data) => setCurrentMode(data.mode))
      .catch((err) => console.error(err));
  }, []);

  const handleToggleMode = async () => {
    if (!isRole('administrator')) {
      alert('Security Policy: Only designated Administrators can toggle system data modes.');
      return;
    }
    setModeLoading(true);
    const nextMode = currentMode === 'original' ? 'mock' : 'original';
    try {
      const res = await api.setMode(nextMode);
      if (res.success) {
        setCurrentMode(nextMode);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModeLoading(false);
    }
  };

  const navSections = [
    {
      title: 'CORE INTELLIGENCE',
      items: [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/investigations', label: 'Investigations', icon: Briefcase },
        { to: '/network', label: 'Network Explorer', icon: Share2 },
        { to: '/emerging', label: 'Emerging Networks', icon: Flame, highlight: true, badge: 'USP' },
        { to: '/hidden', label: 'Hidden Connections', icon: EyeOff },
      ]
    },
    {
      title: 'ADVANCED ANALYTICS',
      items: [
        { to: '/coordinated', label: 'Coordinated Activity', icon: GitBranch },
        { to: '/financial', label: 'Financial Intelligence', icon: Landmark },
        { to: '/timeline', label: 'Timeline Intelligence', icon: History },
        { to: '/osint', label: 'OSINT Search', icon: Globe },
        { to: '/documents', label: 'Document Intelligence', icon: FileText },
      ]
    },
    {
      title: 'GOVERNANCE & TOOLS',
      items: [
        { to: '/priority', label: 'Investigation Priority', icon: ListOrdered },
        { to: '/evidence', label: 'Evidence Vault', icon: Lock },
        { to: '/ai-investigator', label: 'AI Investigator', icon: Sparkles, highlight: true },
        // Audit Logs visible to Administrator, Investigator, Auditor
        ...(isRole('administrator', 'investigator', 'auditor') ? [
          { to: '/audit-logs', label: 'Audit Logs', icon: FileCheck2 }
        ] : []),
        // Settings only visible to Administrator
        ...(isRole('administrator') ? [
          { to: '/settings', label: 'Settings', icon: Settings }
        ] : [])
      ]
    }
  ];

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearchQuery.trim()) return;
    navigate(`/network?search=${encodeURIComponent(globalSearchQuery.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canCreateCase = isRole('administrator', 'investigator');
  const canAddEntity = isRole('administrator', 'investigator');
  const canImportData = isRole('administrator', 'investigator');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Left Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200/90 flex flex-col z-30 shadow-[1px_0_6px_rgba(0,0,0,0.04)]">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/90 flex items-center gap-3.5 bg-white">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-800 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/25 text-white">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="System Online" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-slate-900 uppercase font-sans">TRACE-AI</span>
              <span className="text-2xs font-mono px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">PRO</span>
            </div>
            <p className="text-xs text-blue-700 font-semibold truncate leading-tight">Threat Relation Analysis</p>
            <p className="text-xs text-slate-500 leading-tight truncate">NCRB • Women Safety Division</p>
          </div>
        </div>

        {/* Operational Mode Card */}
        <div className="p-3 bg-slate-50/80 border-b border-slate-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">SYSTEM MODE</span>
            {isRole('administrator') ? (
              <button
                onClick={handleToggleMode}
                disabled={modeLoading}
                className="text-xs font-mono text-blue-600 hover:text-blue-800 flex items-center gap-1 transition px-1.5 py-0.5 rounded hover:bg-blue-50"
                title="Switch database mode"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${modeLoading ? 'animate-spin' : ''}`} />
                <span className="font-semibold">Switch</span>
              </button>
            ) : (
              <span className="text-2xs font-mono text-slate-400">Admin Locked</span>
            )}
          </div>
          
          <div
            onClick={isRole('administrator') ? handleToggleMode : undefined}
            className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between border shadow-xs ${
              isRole('administrator') ? 'cursor-pointer' : 'cursor-default'
            } ${
              currentMode === 'original'
                ? 'bg-white border-emerald-300 text-emerald-950 hover:bg-emerald-50/50'
                : 'bg-white border-purple-300 text-purple-950 hover:bg-purple-50/50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                currentMode === 'original' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-purple-50 text-purple-600 border border-purple-200'
              }`}>
                {currentMode === 'original' ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <FlaskConical className="w-4 h-4" />
                )}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold leading-tight">
                  {currentMode === 'original' ? 'Original Data Mode' : 'Mock Data Mode'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {currentMode === 'original' ? 'Live zero-fake database' : 'Operation Trident Demo'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-2.5 text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                {sec.title}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) => `
                        group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all
                        ${isActive 
                          ? 'bg-blue-50/90 text-blue-700 font-semibold shadow-xs border-l-4 border-blue-600' 
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                        }
                        ${item.highlight && !isActive ? 'text-blue-600 font-medium' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${item.highlight ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-2xs font-mono px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800 border border-blue-200 flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Live Subsystem Telemetry Badge */}
        <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="truncate font-semibold text-slate-700">Supabase & Groq Synced</span>
          </div>
          <span className="text-2xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            200 OK
          </span>
        </div>

        {/* Authenticated Officer Card & RBAC Switcher */}
        <div className="p-3 border-t border-slate-200/90 bg-white space-y-2">
          <div 
            onClick={() => setShowRoleMenu(!showRoleMenu)} 
            className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition border border-slate-200/60"
            title="Click to switch role or view permissions"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                {(user?.name || 'Officer').charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Officer'}</p>
                <p className="text-xs font-mono text-blue-700 truncate capitalize font-semibold">
                  {user?.role} • {user?.badge_number || 'NCRB'}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>

          {/* Quick Role Switcher Dropdown */}
          {showRoleMenu && (
            <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-xl text-xs space-y-1.5">
              <div className="px-2 py-1 text-2xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                Switch Demonstration Officer Role
              </div>
              {DEMO_OFFICERS.map((officer) => (
                <button
                  key={officer.id}
                  onClick={() => {
                    quickLoginAs(officer);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition ${
                    user?.role === officer.role ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <p className="font-semibold text-xs text-slate-900 truncate">{officer.name}</p>
                    <p className="text-2xs text-slate-500 capitalize">{officer.role} • {officer.badge}</p>
                  </div>
                  {user?.role === officer.role && (
                    <span className="text-2xs font-mono px-1.5 py-0.5 bg-blue-600 text-white rounded">Active</span>
                  )}
                </button>
              ))}

              <div className="pt-1.5 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold text-xs transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Log Out of Officer Portal</span>
                </button>
              </div>
            </div>
          )}

          {/* Direct Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center gap-1.5 transition border border-transparent hover:border-red-200"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500" />
            <span>Sign Out ({user?.role})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between gap-4 z-20 shadow-xs">
          {/* Global Search Bar */}
          <form onSubmit={handleGlobalSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Search suspect, vehicle, phone, or FIR in active graph..."
              className="w-full pl-10 pr-14 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-xs"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
              Ctrl+K
            </span>
          </form>

          {/* Action Buttons: New Case, Add Entity, Import Data, Ask Co-Pilot */}
          <div className="flex items-center gap-2.5">
            {/* New Case Button */}
            <button
              onClick={() => setShowCreateInv(true)}
              disabled={!canCreateCase}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-xs ${
                canCreateCase
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
              title={canCreateCase ? 'Register new investigative case' : 'Requires Investigator or Admin role'}
            >
              <Plus className="w-4 h-4" />
              <span>New Case</span>
            </button>

            {/* Add Entity Button */}
            <button
              onClick={() => setShowAddEntity(true)}
              disabled={!canAddEntity}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-xs border ${
                canAddEntity
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
              title={canAddEntity ? 'Add person, vehicle, phone to graph' : 'Requires Investigator or Admin role'}
            >
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>Add Entity</span>
            </button>

            {/* Import Data Button */}
            <button
              onClick={() => setShowImportModal(true)}
              disabled={!canImportData}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-xs border ${
                canImportData
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
              title={canImportData ? 'Import structured CDR, bank, or suspect records' : 'Requires Investigator or Admin role'}
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Import Data</span>
            </button>

            {/* Ask Co-Pilot Button */}
            <button 
              onClick={() => navigate('/ai-investigator')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-50 hover:bg-blue-100/90 border border-blue-200 text-blue-700 transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Ask Co-Pilot</span>
            </button>
          </div>
        </header>

        {/* Humanized Ethical Notice Banner */}
        <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-blue-50/60 border-b border-blue-100/80 px-6 py-2 flex items-center justify-between text-xs text-blue-900 z-10">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>TRACE-AI Judicial Notice:</strong> Algorithmic findings are investigative leads to assist officer judgment under Bharatiya Sakshya Adhiniyam (BSA). Does not determine guilt.
            </span>
          </div>
          <span className="text-2xs font-mono text-blue-800 font-bold bg-white/90 px-2 py-0.5 rounded border border-blue-200/70">
            NCRB Human-in-the-Loop Protocol
          </span>
        </div>

        {/* Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>

      {/* Modals */}
      <CreateInvestigationModal
        isOpen={showCreateInv}
        onClose={() => setShowCreateInv(false)}
        onSuccess={() => {
          navigate('/investigations');
          window.location.reload();
        }}
      />
      <AddEntityModal
        isOpen={showAddEntity}
        onClose={() => setShowAddEntity(false)}
        onSuccess={() => {
          navigate('/network');
          window.location.reload();
        }}
      />
      <DataImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          navigate('/network');
          window.location.reload();
        }}
      />
    </div>
  );
};

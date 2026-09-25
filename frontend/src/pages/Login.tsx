import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth, DEMO_OFFICERS, DemoOfficerProfile } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login, quickLoginAs, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectPath = (location.state as any)?.from?.pathname || '/';

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your registered official email or select a profile below.');
      return;
    }
    setError(null);
    const success = await login(email.trim(), password);
    if (success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError('Invalid official credentials. You may use any of the quick-login roles below.');
    }
  };

  const handleQuickLogin = async (officer: DemoOfficerProfile) => {
    setError(null);
    const success = await quickLoginAs(officer);
    if (success) {
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-between p-6 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Government Portal Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/40">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wider text-white uppercase">TRACE-AI</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-bold">
                SIH 26189
              </span>
            </div>
            <p className="text-xs text-blue-200/90 font-medium">Threat Relation Analysis & Crime Exploration</p>
          </div>
        </div>

        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-bold text-slate-200 tracking-wide">MINISTRY OF HOME AFFAIRS • GOVT. OF INDIA</span>
          <span className="text-xs text-slate-400">National Crime Records Bureau (NCRB) • Women Safety Division</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Information & Statutory Disclaimer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI-Driven Heterogeneous Network Intelligence</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Law Enforcement Intelligence & Investigation Portal
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Secure, authenticated access for authorized investigators, intelligence analysts, and judicial vigilance officers under the Bharatiya Sakshya Adhiniyam (BSA).
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-2.5 pt-2">
            {[
              'Heterogeneous Graph Mining & Cross-Syndicate Discovery',
              'Multi-Temporal Emerging Crime Network Convergence Alerts',
              'Chain-of-Custody SHA-256 Vault with Tamper Resistance',
              'Privacy-Preserving Role-Based Access Control (RBAC)'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Statutory Warning Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-300 text-sm">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Official Law Enforcement System</span>
            </div>
            <p>
              This computer system is for authorized government law enforcement use only. All sessions, data extractions, and network explorations are cryptographically audited.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form & 1-Click Role Logins */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Officer Portal Access</h2>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md">
                RBAC v2.4
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Sign in with your designated official credentials or select a demonstration profile below.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Role Login Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Select Demonstration Officer Profile (1-Click Login)</span>
              <span className="text-blue-600 font-semibold normal-case">Jury & Evaluation Mode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_OFFICERS.map((officer) => {
                const roleColors = {
                  administrator: 'border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50',
                  investigator: 'border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50',
                  analyst: 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50',
                  auditor: 'border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50'
                };
                const badgeColors = {
                  administrator: 'bg-purple-100 text-purple-800 border-purple-200',
                  investigator: 'bg-blue-100 text-blue-800 border-blue-200',
                  analyst: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  auditor: 'bg-amber-100 text-amber-800 border-amber-200'
                };

                return (
                  <button
                    key={officer.id}
                    type="button"
                    onClick={() => handleQuickLogin(officer)}
                    disabled={loading}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2.5 group shadow-xs ${roleColors[officer.role]}`}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-700 transition">
                          {officer.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{officer.title}</p>
                      </div>
                      <span className={`text-2xs font-mono font-bold uppercase px-2 py-0.5 rounded-md border flex-shrink-0 ${badgeColors[officer.role]}`}>
                        {officer.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-200/60 pt-2 w-full">
                      <span className="font-mono text-2xs text-slate-500 font-semibold">{officer.badge}</span>
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Access &rarr;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">Or Sign In with Official Email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Standard Email / Password Form */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Gov / NCRB Official Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajeshwari.devi@ncrb.gov.in or admin@ncrb.gov.in"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Officer Security Password / Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating Officer...' : 'Authorize & Enter Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>National Crime Records Bureau &bull; Women Safety Division &bull; Ministry of Home Affairs</p>
        <p className="font-mono text-slate-500">TRACE-AI Platform Build 2.4.0 • Secured TLS 1.3</p>
      </footer>
    </div>
  );
};

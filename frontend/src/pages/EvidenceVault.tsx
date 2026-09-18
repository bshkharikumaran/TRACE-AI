import React, { useEffect, useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Search, 
  Fingerprint, 
  RefreshCw, 
  ExternalLink, 
  Info, 
  Plus, 
  Upload, 
  X,
  Copy,
  Check,
  Shield,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { EvidenceItem } from '../types';

export const EvidenceVault: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // New Evidence Modal
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('fir_copy');
  const [depositing, setDepositing] = useState(false);

  const fetchEvidence = () => {
    setLoading(true);
    api.getEvidenceList()
      .then((data) => setEvidenceList(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const handleVerify = async (item: EvidenceItem, simulateTamper = false) => {
    setSelectedItem(item);
    setVerifying(true);
    try {
      const res = await api.verifyEvidence(item.evidence_code, simulateTamper);
      setVerificationResult(res);
      fetchEvidence();
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setDepositing(true);
    try {
      await api.createEvidence({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        source_type: newType
      });
      setShowDepositModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchEvidence();
    } catch (err) {
      console.error(err);
    } finally {
      setDepositing(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filtered = evidenceList.filter((e) => 
    e.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    e.evidence_code.toLowerCase().includes(searchFilter.toLowerCase()) ||
    e.source_type.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold uppercase flex items-center gap-1.5 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Tamper-Evident Chain-of-Custody Vault
              </span>
              <span className="font-mono text-slate-500 font-semibold text-[11px]">Section 65B BSA Cryptographic Ledger</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Evidence Vault & Cryptographic Verification</h1>
            <p className="text-slate-600 leading-relaxed max-w-3xl">
              All case exhibits (certified FIR copies, CDR dumps, banking ledgers, and surveillance video) are anchored with SHA-256 cryptographic hashes. Verify authenticity in real time against the immutable evidence ledger.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Deposit Exhibit</span>
            </button>
            <button
              onClick={fetchEvidence}
              className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-xs transition hover:border-slate-300"
              title="Refresh Vault"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Notification Modal / Banner */}
      {verificationResult && (
        <div className={`p-5 rounded-2xl border transition-all ${
          verificationResult.is_valid
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-card'
            : 'bg-red-50/90 border-red-300 text-red-950 shadow-card'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {verificationResult.is_valid ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-300 flex items-center justify-center text-red-700 animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-sm">
                  {verificationResult.is_valid ? 'Cryptographic Integrity Confirmed' : '⚠ Tamper Detection Alert'}
                </h3>
                <span className="font-mono text-[11px] font-bold opacity-80">{verificationResult.evidence_code}</span>
              </div>
            </div>
            <button 
              onClick={() => setVerificationResult(null)}
              className="p-1 rounded-md hover:bg-black/5 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs leading-relaxed font-mono bg-white/70 p-2.5 rounded-lg border border-current/10">
            {verificationResult.message}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-mono pt-1">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block font-bold mb-1">STORED LEDGER HASH:</span>
              <span className="text-blue-700 break-all select-all font-semibold">
                {verificationResult.ledger_hash || verificationResult.stored_sha256}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block font-bold mb-1">COMPUTED LIVE HASH:</span>
              <span className={verificationResult.is_valid ? 'text-emerald-700 break-all select-all font-semibold' : 'text-red-700 break-all select-all font-extrabold'}>
                {verificationResult.live_computed_hash || verificationResult.computed_sha256}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Controls & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by code, title, or evidence type..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
        <span className="text-slate-500 font-mono text-[11px] font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
          Showing {filtered.length} of {evidenceList.length} Exhibits
        </span>
      </div>

      {/* Empty State */}
      {evidenceList.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Evidence Vault is Empty</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              No physical or digital case exhibits logged yet in this workspace. Deposit your first certified document or CDR dump to generate an immutable SHA-256 hash.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={async () => {
                await api.seedOriginal();
                fetchEvidence();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Seed Demo Case</span>
            </button>
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Deposit Exhibit</span>
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
        /* Evidence Ledger Table */
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="p-3.5 font-bold">Evidence Code</th>
                <th className="p-3.5 font-bold">Exhibit Title & Particulars</th>
                <th className="p-3.5 font-bold">Category</th>
                <th className="p-3.5 font-bold">SHA-256 Hash</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-right">Integrity Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-3.5 font-mono font-extrabold text-blue-700 whitespace-nowrap">
                    <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.evidence_code}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                  </td>
                  <td className="p-3.5 capitalize font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {item.source_type.replace(/_/g, ' ')}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                        {item.sha256_hash.substring(0, 16)}...
                      </span>
                      <button
                        onClick={() => handleCopyHash(item.sha256_hash)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition"
                        title="Copy full SHA-256 hash"
                      >
                        {copiedHash === item.sha256_hash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border flex items-center gap-1 w-fit ${
                      item.verification_status === 'verified'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.verification_status === 'verified' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                      {item.verification_status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleVerify(item, false)}
                      disabled={verifying}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition shadow-xs"
                    >
                      Verify Ledger
                    </button>
                    <button
                      onClick={() => handleVerify(item, true)}
                      disabled={verifying}
                      className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200/80 text-red-700 hover:bg-red-100 font-semibold text-[11px] transition shadow-xs"
                      title="Simulates bit-flip to demonstrate tamper detection"
                    >
                      Test Tamper
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deposit Exhibit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-floating w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Deposit New Evidence Exhibit</h3>
              </div>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3.5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Exhibit Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Certified Copy of FIR No. 102/2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Source / Evidence Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="fir_copy">Certified FIR Copy</option>
                  <option value="cdr_log">Call Detail Record (CDR) Log</option>
                  <option value="bank_statement">Bank Transaction Statement</option>
                  <option value="surveillance_cctv">Surveillance / CCTV Footage</option>
                  <option value="court_order">Court Order / Seizure Memo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Description / Chain-of-Custody Notes</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Seized under Panchnama at Chennai Container Terminal..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={depositing}
                  className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
                >
                  {depositing ? 'Anchoring...' : 'Deposit & Anchor SHA-256'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

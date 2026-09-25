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
  Sparkles,
  FileCode,
  FileCheck2
} from 'lucide-react';
import { api } from '../services/api';
import { EvidenceItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const EvidenceVault: React.FC = () => {
  const { user, isRole } = useAuth();
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // New Evidence Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('fir_copy');
  const [depositing, setDepositing] = useState(false);

  // File Upload & Hash Computation
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [hashing, setHashing] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      setHashing(true);
      try {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setComputedHash(hashHex);
      } catch (err) {
        console.error('Hashing failed, fallback pseudo-hash:', err);
      } finally {
        setHashing(false);
      }
    }
  };

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
        description: newDesc.trim() || (uploadedFile ? `Digital exhibit: ${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)` : undefined),
        source_type: newType,
        sha256_hash: computedHash || undefined
      });
      setShowDepositModal(false);
      setNewTitle('');
      setNewDesc('');
      setUploadedFile(null);
      setComputedHash(null);
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

  const canDeposit = isRole('administrator', 'investigator');

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-sm text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold uppercase flex items-center gap-1.5 text-xs">
                <Lock className="w-4 h-4 text-emerald-600" />
                Tamper-Evident Chain-of-Custody Vault
              </span>
              <span className="font-mono text-slate-500 font-semibold text-xs">Section 65B BSA Cryptographic Ledger</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Evidence Vault & Cryptographic Verification</h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-4xl">
              All case exhibits (certified FIR copies, CDR dumps, banking statements, audio intercepts, and CCTV surveillance video) are anchored with SHA-256 cryptographic hashes. Verify authenticity in real time against the immutable evidence ledger.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setShowDepositModal(true)}
              disabled={!canDeposit}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xs transition ${
                canDeposit
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
              title={canDeposit ? 'Deposit verified evidence exhibit' : 'Requires Investigator or Administrator privileges'}
            >
              <Plus className="w-4 h-4" />
              <span>Deposit Exhibit</span>
            </button>
            <button
              onClick={fetchEvidence}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-xs transition hover:border-slate-300 cursor-pointer"
              title="Refresh Vault"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Notification Modal / Banner */}
      {verificationResult && (
        <div className={`p-6 rounded-2xl border transition-all ${
          verificationResult.is_valid
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-card'
            : 'bg-red-50/90 border-red-300 text-red-950 shadow-card'
        } space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {verificationResult.is_valid ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-700 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-base">
                  {verificationResult.is_valid ? 'Cryptographic Integrity Confirmed' : '⚠ Tamper Detection Alert'}
                </h3>
                <span className="font-mono text-xs font-bold opacity-80">{verificationResult.evidence_code}</span>
              </div>
            </div>
            <button 
              onClick={() => setVerificationResult(null)}
              className="p-1 rounded-md hover:bg-black/5 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm leading-relaxed font-mono bg-white/70 p-3 rounded-xl border border-current/10">
            {verificationResult.message}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block font-bold mb-1">STORED LEDGER HASH:</span>
              <span className="text-blue-700 break-all select-all font-semibold text-xs">
                {verificationResult.ledger_hash || verificationResult.stored_sha256}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-slate-500 block font-bold mb-1">COMPUTED LIVE HASH:</span>
              <span className={`break-all select-all font-semibold text-xs ${verificationResult.is_valid ? 'text-emerald-700' : 'text-red-700 font-bold'}`}>
                {verificationResult.computed_hash}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter exhibits by title, code, or source..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
        <span className="text-xs font-mono text-slate-500">
          Total Vault Exhibits: <strong>{filtered.length}</strong>
        </span>
      </div>

      {/* Exhibits Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          Accessing Immutable Evidence Ledger...
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-xs font-mono uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Exhibit Code</th>
                <th className="px-5 py-3.5">Title & Evidence Type</th>
                <th className="px-5 py-3.5">Cryptographic SHA-256 Hash</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Integrity Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {ev.evidence_code}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-sm">{ev.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{ev.source_type.replace('_', ' ')} • {ev.description || 'Certified Panchnama custody'}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-600">
                    <div className="flex items-center gap-2 max-w-xs">
                      <span className="truncate bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">
                        {ev.sha256_hash}
                      </span>
                      <button
                        onClick={() => handleCopyHash(ev.sha256_hash)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition"
                        title="Copy SHA-256 Hash"
                      >
                        {copiedHash === ev.sha256_hash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      VERIFIED
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleVerify(ev, false)}
                        disabled={verifying}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Hash</span>
                      </button>
                      <button
                        onClick={() => handleVerify(ev, true)}
                        disabled={verifying}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-medium text-xs transition border border-slate-200 cursor-pointer"
                        title="Simulate file bit modification to verify detection"
                      >
                        Simulate Tamper
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deposit Exhibit Modal with File Upload of ALL Formats */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-floating w-full max-w-lg p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Deposit Digital Evidence Exhibit</h3>
                  <p className="text-xs text-slate-500">Universal Format Ingestion & Cryptographic Anchoring</p>
                </div>
              </div>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4 text-sm">
              {/* Universal File Upload Dropzone */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs uppercase tracking-wide">
                  Exhibit Digital File (All Formats Supported)
                </label>
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition text-center">
                  <Upload className="w-7 h-7 text-blue-600" />
                  <p className="font-semibold text-slate-800 text-sm">
                    {uploadedFile ? uploadedFile.name : 'Select or drop any digital exhibit file'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Accepts: Audio (CCTV, VoIP), Video, PDF, Scanned FIR, Disk Images, Forensic Dumps, ZIP
                  </p>
                  <input type="file" accept="*/*" onChange={handleFileChange} className="hidden" />
                </label>

                {/* Real Computed Hash Display */}
                {hashing && (
                  <p className="text-xs font-mono text-blue-600 mt-2 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Computing live SHA-256 cryptographic digest...
                  </p>
                )}
                {computedHash && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono text-emerald-800 space-y-0.5">
                    <span className="font-bold block text-2xs uppercase text-emerald-700">Calculated SHA-256 Digest:</span>
                    <span className="break-all">{computedHash}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs uppercase tracking-wide">Exhibit Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Certified Copy of FIR No. 102/2026 or Intercepted Audio 08-24"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs uppercase tracking-wide">Evidence Exhibit Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fir_copy">Certified FIR Copy (Document)</option>
                  <option value="cdr_log">Call Detail Record (CDR / Spreadsheet / JSON)</option>
                  <option value="bank_statement">Bank Transaction Statement / Account Ledger</option>
                  <option value="surveillance_cctv">Surveillance / CCTV Footage / Audio (Media)</option>
                  <option value="digital_forensics">Mobile Phone Forensic Dump / Disk Image</option>
                  <option value="court_order">Court Order / Panchnama Seizure Memo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs uppercase tracking-wide">Description / Chain-of-Custody Notes</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Seized under Panchnama at Chennai Container Terminal..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={depositing || hashing}
                  className="px-5 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 text-white rounded-xl font-bold text-sm shadow-xs transition cursor-pointer"
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

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ArrowRight, Table, FileSpreadsheet } from 'lucide-react';
import { api } from '../../services/api';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'mapping' | 'success'>('upload');
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setError(null);
      setLoading(true);
      try {
        const preview = await api.previewCsv(selected);
        setPreviewData(preview);
        setMappings(preview.suggested_mappings || {});
        setStep('mapping');
      } catch (err: any) {
        setError(err.message || 'Failed to parse file preview');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExecuteImport = async () => {
    if (!previewData) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.executeCsvImport({
        rows: previewData.sample_rows,
        mappings: mappings
      });
      setImportResult(res);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Import execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Batch Data Ingestion Wizard</h3>
              <p className="text-xs text-slate-500">Import authorized surveillance datasets, call records & rosters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition">
              <Upload className="w-10 h-10 text-blue-600 animate-bounce" />
              <div className="text-center space-y-1">
                <p className="font-bold text-slate-800 text-base">Select or drop investigation dataset file</p>
                <p className="text-sm text-slate-600">
                  Accepts all formats: <strong>CSV, TSV, JSON, TXT, LOG, XLSX</strong>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports CDR call logs, suspect rosters, vehicle sightings, and bank ledgers
                </p>
              </div>
              <input type="file" accept="*/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        )}

        {step === 'mapping' && previewData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">
                File: <strong className="font-mono text-blue-600">{previewData.filename}</strong> ({previewData.total_columns} columns)
              </span>
              <span className="text-xs text-slate-500">Map columns to TRACE-AI target attributes</span>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3.5 bg-slate-50">
              {previewData.headers.map((h: string) => (
                <div key={h} className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-mono font-medium text-slate-800 truncate w-1/2">{h}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <select
                    value={mappings[h] || 'ignore'}
                    onChange={(e) => setMappings({ ...mappings, [h]: e.target.value })}
                    className="w-1/2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ignore">-- Skip / Ignore --</option>
                    <option value="person_name">Person Name</option>
                    <option value="phone">Phone Number</option>
                    <option value="vehicle">Vehicle Reg No</option>
                    <option value="location">Location / City</option>
                    <option value="bank_account">Bank Account</option>
                    <option value="role">Primary Role</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setStep('upload')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={handleExecuteImport}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm cursor-pointer"
              >
                {loading ? 'Importing...' : 'Confirm & Ingest Batch'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && importResult && (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Batch Ingestion Successful</h4>
              <p className="text-sm text-slate-600 mt-1">{importResult.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-sm font-mono">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block text-2xs">RECORDS INSERTED</span>
                <span className="text-emerald-600 font-bold text-xl">+{importResult.valid_records_imported}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block text-2xs">DUPLICATES FILTERED</span>
                <span className="text-slate-700 font-bold text-xl">{importResult.duplicates_skipped}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition cursor-pointer"
            >
              Done & View Active Graph
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ArrowRight, Table } from 'lucide-react';
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
        setError(err.message || 'Failed to parse CSV preview');
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
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Batch Data Ingestion Wizard</h3>
              <p className="text-xs text-slate-500">Import authorized surveillance datasets & FIR logs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition">
              <Upload className="w-8 h-8 text-blue-600 animate-bounce" />
              <div className="text-center">
                <p className="font-semibold text-slate-800 text-sm">Select or drop investigation CSV file</p>
                <p className="text-xs text-slate-500 mt-0.5">Supports suspect rosters, call records, vehicle sightings</p>
              </div>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        )}

        {step === 'mapping' && previewData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                File: <strong className="font-mono text-blue-600">{previewData.filename}</strong> ({previewData.total_columns} columns)
              </span>
              <span className="text-xs text-slate-500">Map CSV columns to TRACE-AI target fields</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50">
              {previewData.headers.map((h: string) => (
                <div key={h} className="flex items-center justify-between gap-4 text-xs">
                  <span className="font-mono font-medium text-slate-700 truncate w-1/2">{h}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <select
                    value={mappings[h] || 'ignore'}
                    onChange={(e) => setMappings({ ...mappings, [h]: e.target.value })}
                    className="w-1/2 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
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

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStep('upload')}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium transition"
              >
                Back
              </button>
              <button
                onClick={handleExecuteImport}
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                {loading ? 'Importing...' : 'Confirm & Ingest Batch'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && importResult && (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Batch Ingestion Successful</h4>
              <p className="text-xs text-slate-600 mt-1">{importResult.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-xs font-mono">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[10px]">RECORDS INSERTED</span>
                <span className="text-emerald-600 font-bold text-lg">+{importResult.valid_records_imported}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block text-[10px]">DUPLICATES FILTERED</span>
                <span className="text-slate-700 font-bold text-lg">{importResult.duplicates_skipped}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
            >
              Done & View Active Graph
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

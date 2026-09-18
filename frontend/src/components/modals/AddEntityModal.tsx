import React, { useState } from 'react';
import { X, UserPlus, Plus } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newEntity: any) => void;
}

export const AddEntityModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [entityType, setEntityType] = useState('person');
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('suspect');
  const [occupation, setOccupation] = useState('');
  const [riskScore, setRiskScore] = useState(65);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const payload = {
        type: entityType,
        name: name.trim(),
        alias: alias.trim(),
        role,
        occupation: occupation.trim() || 'Entity of interest',
        risk_score: Number(riskScore)
      };
      const res = await api.addEntity(payload);
      onSuccess(res.entity);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Add Entity of Interest</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Entity Type</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="person">Person of Interest</option>
                <option value="phone">Phone / SIM Device</option>
                <option value="vehicle">Vehicle (Vahan Record)</option>
                <option value="location">Location / Warehouse</option>
                <option value="bank_account">Bank Account / Mule</option>
                <option value="organization">Corporate Front / Org</option>
                <option value="fir">FIR / Crime Incident</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assigned Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Coordinator, Mule, Bridge"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Name or Identifier *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                entityType === 'vehicle' ? 'e.g. DL-01-AX-9921 (Black Fortuner)' :
                entityType === 'phone' ? 'e.g. +91 98110 XXXXX' :
                entityType === 'bank_account' ? 'e.g. HDFC BKC Acc #992140' :
                'e.g. Vikram Malhotra'
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {entityType === 'person' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Known Alias</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g. V.M. / The Fixer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Occupation / Cover</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Transport Contractor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-700">Initial Threat / Priority Indicator</label>
              <span className="font-mono text-blue-600 font-bold">{riskScore}/100</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={riskScore}
              onChange={(e) => setRiskScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? 'Adding...' : 'Add to Graph'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

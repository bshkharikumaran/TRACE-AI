import React, { useState } from 'react';
import { X, Link2, Plus } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRel: any) => void;
  availableNodes?: Array<{ id: string; label: string; type: string }>;
}

export const AddRelationshipModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  availableNodes = []
}) => {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [relType, setRelType] = useState('associated_with');
  const [confidence, setConfidence] = useState(85);
  const [sourceNote, setSourceNote] = useState('Field Intelligence & Telecommunication Intercept');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;
    setLoading(true);
    try {
      const payload = {
        source_id: sourceId,
        target_id: targetId,
        relationship_type: relType,
        confidence: Number(confidence),
        source: sourceNote.trim() || 'Officer Manual Link Entry'
      };
      const res = await api.addRelationship(payload);
      onSuccess(res.relationship);
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
            <Link2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Create Relationship Edge</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Source Entity (Origin) *</label>
            {availableNodes.length > 0 ? (
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="">Select origin entity...</option>
                {availableNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                placeholder="e.g. per-p-014"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Relationship Type</label>
            <select
              value={relType}
              onChange={(e) => setRelType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="associated_with">associated_with (General Association)</option>
              <option value="called">called (Telecommunication / CDR)</option>
              <option value="met">met (Physical Meeting / Surveillance)</option>
              <option value="transferred_money">transferred_money (Financial Flow)</option>
              <option value="owns">owns (Ownership / Custody)</option>
              <option value="visited">visited (Location Geofence)</option>
              <option value="worked_with">worked_with (Operational Subordinate)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Entity (Destination) *</label>
            {availableNodes.length > 0 ? (
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="">Select target entity...</option>
                {availableNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="e.g. per-p-021"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-700">Confidence Assessment</label>
              <span className="font-mono text-blue-600 font-bold">{confidence}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Source / Evidence Basis</label>
            <input
              type="text"
              value={sourceNote}
              onChange={(e) => setSourceNote(e.target.value)}
              placeholder="e.g. CDR tower logs, eyewitness statement, bank statement"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500"
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
              disabled={loading || !sourceId || !targetId}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? 'Linking...' : 'Connect Edge'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

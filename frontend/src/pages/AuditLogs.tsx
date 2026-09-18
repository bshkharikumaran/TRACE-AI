import React, { useEffect, useState } from 'react';
import { 
  FileCheck2, 
  Shield, 
  Clock, 
  User, 
  Search, 
  Filter,
  CheckCircle,
  Database,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { AuditLog } from '../types';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs()
      .then((data) => setLogs(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((l) => 
    l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
    l.entity_type.toLowerCase().includes(filterQuery.toLowerCase()) ||
    l.entity_id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const getActionBadgeColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('VERIF')) return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    if (act.includes('LOGIN') || act.includes('AUTH')) return 'bg-blue-50 border-blue-200 text-blue-800';
    if (act.includes('CREATE') || act.includes('INSERT')) return 'bg-indigo-50 border-indigo-200 text-indigo-800';
    if (act.includes('DELETE') || act.includes('REMOVE')) return 'bg-rose-50 border-rose-200 text-rose-800';
    if (act.includes('QUERY') || act.includes('SEARCH')) return 'bg-purple-50 border-purple-200 text-purple-800';
    return 'bg-slate-100 border-slate-200 text-slate-800';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold uppercase flex items-center gap-1.5 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Immutable Audit Trail
          </span>
          <span className="font-mono text-slate-500 font-semibold text-[11px]">Section 65B Indian Evidence Act Compliance</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit Trail & Chain of Custody</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Complete, cryptographically verified event logs recording every user login, evidence verification, OSINT search, entity modification, and AI query for strict legal accountability.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search action (LOGIN, VERIFY), entity..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
        <span className="text-[11px] font-mono text-slate-600 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Total Logged Events: {logs.length}
        </span>
      </div>

      {/* Logs Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-slate-500 font-mono text-[10px] uppercase bg-slate-50/80">
              <th className="py-3 px-3.5 font-bold">Timestamp</th>
              <th className="py-3 px-3.5 font-bold">Officer / User</th>
              <th className="py-3 px-3.5 font-bold">Action</th>
              <th className="py-3 px-3.5 font-bold">Entity Type</th>
              <th className="py-3 px-3.5 font-bold">Target Identifier</th>
              <th className="py-3 px-3.5 font-bold">Telemetry Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="py-3 px-3.5 text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-3.5 text-blue-700 font-bold">{log.user_id}</td>
                <td className="py-3 px-3.5">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase ${getActionBadgeColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-3.5 uppercase text-slate-600 font-medium">{log.entity_type}</td>
                <td className="py-3 px-3.5 text-slate-900 font-bold truncate max-w-[160px]">{log.entity_id}</td>
                <td className="py-3 px-3.5 text-slate-500 truncate max-w-[220px] text-[10px]">
                  {JSON.stringify(log.metadata || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

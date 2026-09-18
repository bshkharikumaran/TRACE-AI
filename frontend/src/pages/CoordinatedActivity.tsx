import React, { useEffect, useState } from 'react';
import { 
  GitBranch, 
  PhoneCall, 
  Landmark, 
  Users, 
  Car, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle, 
  ExternalLink,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CoordinatedActivity } from '../types';

export const CoordinatedActivityView: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CoordinatedActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<CoordinatedActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCoordinatedActivities()
      .then((data) => {
        setActivities(data);
        if (data.length > 0) setSelectedActivity(data[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'communication': return PhoneCall;
      case 'financial_transfer': return Landmark;
      case 'meeting': return Users;
      case 'vehicle_movement': return Car;
      case 'incident': return AlertTriangle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 font-mono text-xs">
        Synthesizing sliding-window temporal causal sequences...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold uppercase flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-blue-600" />
            Sequential Timeline Pattern Detector
          </span>
          <span className="font-mono text-slate-500 font-semibold">Sliding Time Window Causal Graph</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">Coordinated Syndicate Activity Sequences</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Detecting structured multi-step operational chains where telecommunication directives trigger immediate financial disbursements, vehicle movements, and coordinated field incidents.
        </p>
      </div>

      {/* Empty State */}
      {activities.length === 0 ? (
        <div className="p-10 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto">
            <GitBranch className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Coordinated Operational Sequences Found</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              When call records, bank transfers, and vehicle checkpoints show causal succession within tight time intervals, automated sequence reconstruction appears here.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/documents')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-xs transition"
            >
              Ingest Incident CDR & Timeline
            </button>
            <button
              onClick={async () => {
                await api.setMode('mock');
                window.location.reload();
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-semibold text-xs transition"
            >
              Switch to Demo Mode
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Activity Selector */}
          <div className="flex items-center gap-2">
            {activities.map((act) => (
              <button
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 border ${
                  selectedActivity?.id === act.id
                    ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GitBranch className="w-4 h-4 text-blue-600" />
                <span>{act.code}: {act.title}</span>
              </button>
            ))}
          </div>

          {selectedActivity && (
            <div className="space-y-6">
              {/* Summary KPI Banner */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="font-mono text-xs text-blue-700 font-bold uppercase block">{selectedActivity.code}</span>
                    <h2 className="text-base font-bold text-slate-900">{selectedActivity.title}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-500 block uppercase font-semibold">Confidence</span>
                      <span className="text-xl font-bold font-mono text-blue-600">{selectedActivity.metrics?.confidence_score ?? 90}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedActivity.summary}
                </p>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 text-center font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Participants</span>
                    <span className="text-sm font-bold text-slate-900">{selectedActivity.metrics?.participants_count ?? 0} Entities</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Locations</span>
                    <span className="text-sm font-bold text-purple-700">{selectedActivity.metrics?.locations_count ?? 0} Hubs</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Communications</span>
                    <span className="text-sm font-bold text-emerald-700">{selectedActivity.metrics?.communication_links_count ?? 0} Relays</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Capital Legs</span>
                    <span className="text-sm font-bold text-amber-700">{selectedActivity.metrics?.financial_links_count ?? 0} Transfers</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Time Window</span>
                    <span className="text-sm font-bold text-red-700">{selectedActivity.metrics?.time_window_hours ?? 0} Hours</span>
                  </div>
                </div>
              </div>

              {/* Sequential Step Timeline */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Step-by-Step Chronological Progression</span>
                </h3>

                <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {selectedActivity.steps.map((step) => {
                    const Icon = getStepIcon(step.event_type);
                    return (
                      <div key={step.step_number} className="relative pl-10 space-y-2">
                        {/* Number Badge */}
                        <div className="absolute left-2 top-0 -translate-x-1/2 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs z-10 shadow-xs">
                          {step.step_number}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-blue-600" />
                              <span className="font-bold text-slate-900 text-sm">{step.title}</span>
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                                {step.event_type.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-slate-500">{step.timestamp}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            <div>
                              <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold">Actor:</span>
                              <span className="font-semibold text-blue-700">{step.actor}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold">Target / Beneficiary:</span>
                              <span className="font-semibold text-slate-800">{step.target}</span>
                            </div>
                            {step.amount && (
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold">Disbursed Capital:</span>
                                <span className="font-bold font-mono text-amber-700">{step.amount}</span>
                              </div>
                            )}
                            {step.location && (
                              <div>
                                <span className="text-[9px] font-mono text-slate-500 uppercase block font-semibold">Location:</span>
                                <span className="font-semibold text-purple-700">{step.location}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-slate-600 text-xs leading-relaxed pt-1">
                            {step.description}
                          </p>

                          {step.evidence_ref && (
                            <div className="pt-2 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                              <span>Corroborating Evidence:</span>
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                {step.evidence_ref}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

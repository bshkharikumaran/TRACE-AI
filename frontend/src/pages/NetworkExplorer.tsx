import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NetworkGraph } from '../components/graph/NetworkGraph';
import { NodeInspector } from '../components/graph/NodeInspector';
import { AddEntityModal } from '../components/modals/AddEntityModal';
import { AddRelationshipModal } from '../components/modals/AddRelationshipModal';
import { DataImportModal } from '../components/modals/DataImportModal';
import { api } from '../services/api';
import { CytoscapeElements, CytoscapeNodeData } from '../types';
import { Activity, Shield, RefreshCw, UserPlus, Link2, Upload, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NetworkExplorer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get('search');
  const navigate = useNavigate();

  const [elements, setElements] = useState<CytoscapeElements>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<CytoscapeNodeData | null>(null);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Modals
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [showAddRel, setShowAddRel] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchGraphData = () => {
    setLoading(true);
    api.getNetworkElements(undefined, undefined, 300)
      .then((data) => {
        setElements(data);
        if (searchParam) {
          const match = data.nodes.find(
            (n) => n.data.label.toLowerCase().includes(searchParam.toLowerCase()) ||
                   n.data.code?.toLowerCase().includes(searchParam.toLowerCase())
          );
          if (match) {
            setSelectedNode(match.data);
            setFocusId(match.data.id);
          }
        } else if (data.nodes.length > 0) {
          setSelectedNode(data.nodes[0].data);
          setFocusId(data.nodes[0].data.id);
        } else {
          setSelectedNode(null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGraphData();
  }, [searchParam]);

  const handleSelectNeighbor = (nodeId: string) => {
    const target = elements.nodes.find((n) => n.data.id === nodeId);
    if (target) {
      setSelectedNode(target.data);
      setFocusId(target.data.id);
    }
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await api.seedOriginal();
      fetchGraphData();
    } catch (err) {
      console.error('Failed to seed demo:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-3 text-xs text-slate-800">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Network Explorer (Graph Intelligence Canvas)
            </h1>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
            {elements.nodes.length} Nodes • {elements.edges.length} Edges
          </span>
        </div>

        <div className="flex items-center gap-2">
          {elements.nodes.length === 0 && (
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{seeding ? 'Seeding...' : 'Seed Demo Data'}</span>
            </button>
          )}

          <button
            onClick={() => setShowAddEntity(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Entity</span>
          </button>

          {elements.nodes.length >= 2 && (
            <button
              onClick={() => setShowAddRel(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
            >
              <Link2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Link Two Entities</span>
            </button>
          )}

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-xs"
            title="Import CSV data"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={fetchGraphData}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition shadow-xs"
            title="Refresh Graph Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas + Right Inspector Area */}
      <div className="flex-1 flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm relative">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-500">
            <Activity className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-xs font-mono">Synthesizing active relationship graph...</p>
          </div>
        ) : elements.nodes.length === 0 ? (
          /* Humanized Empty State */
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-center p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <div className="max-w-md space-y-1">
              <h2 className="text-base font-bold text-slate-900">No Entities in Active Graph</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your live workspace is clean and ready. Add suspects, vehicles, or phone devices manually, or ingest a case file to generate the graph automatically.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSeedDemo}
                disabled={seeding}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{seeding ? 'Seeding...' : 'Seed Demonstration Investigation'}</span>
              </button>
              <button
                onClick={() => setShowAddEntity(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add First Entity</span>
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-semibold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Import CSV File</span>
              </button>
              <button
                onClick={() => navigate('/documents')}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-semibold text-xs flex items-center gap-2 shadow-xs transition"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Ingest Case Report</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 relative h-full">
              <NetworkGraph
                elements={elements}
                onSelectNode={(node) => setSelectedNode(node)}
                selectedNodeId={selectedNode?.id}
                focusNodeId={focusId}
              />
            </div>

            {selectedNode && (
              <NodeInspector
                nodeData={selectedNode}
                onClose={() => setSelectedNode(null)}
                onSelectNeighbor={handleSelectNeighbor}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <AddEntityModal
        isOpen={showAddEntity}
        onClose={() => setShowAddEntity(false)}
        onSuccess={() => {
          setShowAddEntity(false);
          fetchGraphData();
        }}
      />
      <AddRelationshipModal
        isOpen={showAddRel}
        onClose={() => setShowAddRel(false)}
        onSuccess={() => {
          setShowAddRel(false);
          fetchGraphData();
        }}
        availableNodes={elements.nodes.map((n) => ({
          id: n.data.id,
          label: n.data.label,
          type: n.data.type
        }))}
      />
      <DataImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          setShowImportModal(false);
          fetchGraphData();
        }}
      />
    </div>
  );
};

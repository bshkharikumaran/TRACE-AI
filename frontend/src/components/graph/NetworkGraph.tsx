import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Filter, 
  Search, 
  Eye, 
  SlidersHorizontal,
  Navigation,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { CytoscapeElements, CytoscapeNodeData } from '../../types';

interface NetworkGraphProps {
  elements: CytoscapeElements;
  onSelectNode: (node: CytoscapeNodeData) => void;
  selectedNodeId?: string;
  focusNodeId?: string;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  elements,
  onSelectNode,
  selectedNodeId,
  focusNodeId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const [activeLayout, setActiveLayout] = useState<'cose' | 'concentric' | 'breadthfirst' | 'circle'>('cose');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    person: true,
    phone: true,
    vehicle: true,
    location: true,
    organization: true,
    bank_account: true,
    fir: true
  });
  const [shortestPathSource, setShortestPathSource] = useState<string>('');
  const [shortestPathTarget, setShortestPathTarget] = useState<string>('');

  useEffect(() => {
    if (!containerRef.current) return;

    // Filter elements according to activeFilters
    const filteredNodes = elements.nodes.filter(
      (n) => activeFilters[n.data.type] !== false
    );
    const validIds = new Set(filteredNodes.map((n) => n.data.id));
    const filteredEdges = elements.edges.filter(
      (e) => validIds.has(e.data.source) && validIds.has(e.data.target)
    );

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...filteredNodes, ...filteredEdges],
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        // Default Node styling for Government Light Theme
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#0f172a',
            'font-size': '11px',
            'font-weight': 600,
            'font-family': 'Inter, system-ui, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 7,
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.95,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'border-width': 2.5,
            'border-color': '#cbd5e1',
            'background-color': '#f8fafc',
            'width': 36,
            'height': 36,
            'transition-property': 'background-color, border-color, border-width, width, height',
            'transition-duration': 0.2
          }
        },
        // Person Node Styling
        {
          selector: 'node[type = "person"]',
          style: {
            'shape': 'ellipse',
            'background-color': '#2563eb',
            'border-color': '#1e40af',
            'width': 40,
            'height': 40
          }
        },
        // High-Risk Coordinator Person
        {
          selector: 'node[code = "P-014"]',
          style: {
            'shape': 'diamond',
            'background-color': '#dc2626',
            'border-color': '#991b1b',
            'border-width': 3.5,
            'width': 50,
            'height': 50,
            'font-weight': 'bold',
            'font-size': '12px'
          }
        },
        // Phone Node
        {
          selector: 'node[type = "phone"]',
          style: {
            'shape': 'round-rectangle',
            'background-color': '#059669',
            'border-color': '#047857',
            'width': 30,
            'height': 30
          }
        },
        // Vehicle Node
        {
          selector: 'node[type = "vehicle"]',
          style: {
            'shape': 'hexagon',
            'background-color': '#d97706',
            'border-color': '#b45309',
            'width': 34,
            'height': 34
          }
        },
        // Bank Account Node
        {
          selector: 'node[type = "bank_account"]',
          style: {
            'shape': 'round-diamond',
            'background-color': '#e11d48',
            'border-color': '#be123c',
            'width': 32,
            'height': 32
          }
        },
        // Location Node
        {
          selector: 'node[type = "location"]',
          style: {
            'shape': 'triangle',
            'background-color': '#7c3aed',
            'border-color': '#6d28d9',
            'width': 34,
            'height': 34
          }
        },
        // Organization Node
        {
          selector: 'node[type = "organization"]',
          style: {
            'shape': 'vee',
            'background-color': '#0891b2',
            'border-color': '#0e7490',
            'width': 38,
            'height': 38
          }
        },
        // FIR Node
        {
          selector: 'node[type = "fir"]',
          style: {
            'shape': 'star',
            'background-color': '#ea580c',
            'border-color': '#c2410c',
            'width': 36,
            'height': 36
          }
        },
        // Selected Node Highlight
        {
          selector: 'node:selected',
          style: {
            'border-color': '#2563eb',
            'border-width': 4.5,
            'shadow-blur': 16,
            'shadow-color': '#60a5fa',
            'shadow-opacity': 0.8
          }
        },
        // Default Edge Styling for Light Theme
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.8,
            'label': 'data(relationship_type)',
            'font-size': '9px',
            'font-weight': 500,
            'color': '#334155',
            'text-rotation': 'autorotate',
            'text-margin-y': -6,
            'text-background-color': '#ffffff',
            'text-background-opacity': 0.92,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle'
          }
        },
        // Financial flow edge
        {
          selector: 'edge[relationship_type = "transferred_money"]',
          style: {
            'line-color': '#d97706',
            'target-arrow-color': '#d97706',
            'width': 2.8,
            'line-style': 'dashed'
          }
        },
        // Communication edge
        {
          selector: 'edge[relationship_type = "called"], edge[relationship_type = "communicated_with"]',
          style: {
            'line-color': '#059669',
            'target-arrow-color': '#059669',
            'width': 2.4
          }
        },
        // Highlighted Path
        {
          selector: '.highlighted-path',
          style: {
            'line-color': '#2563eb',
            'target-arrow-color': '#2563eb',
            'width': 4.5,
            'z-index': 999
          }
        },
        {
          selector: 'node.highlighted-path',
          style: {
            'border-color': '#2563eb',
            'border-width': 4.5,
            'shadow-blur': 18,
            'shadow-color': '#93c5fd'
          }
        }
      ] as any,
      layout: {
        name: activeLayout,
        animate: true,
        animationDuration: 500,
        padding: 60
      }
    });

    cyRef.current = cy;

    // Node click handler
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      onSelectNode(node.data());
    });

    // If focusNodeId provided, center and zoom into it
    if (focusNodeId) {
      const target = cy.getElementById(focusNodeId);
      if (target.length > 0) {
        cy.center(target);
        cy.zoom({ level: 1.6, position: target.position() });
        target.select();
      }
    }

    return () => {
      cy.destroy();
    };
  }, [elements, activeFilters]);

  // Handle smooth layout transition animation
  useEffect(() => {
    if (!cyRef.current) return;
    try {
      const layoutInstance = cyRef.current.layout({
        name: activeLayout,
        animate: true,
        animationDuration: 600,
        fit: true,
        padding: 50,
        nodeDimensionsIncludeLabels: true
      } as any);
      layoutInstance.run();
    } catch (err) {
      console.warn('Layout transition error:', err);
    }
  }, [activeLayout]);

  // Handle focus on node update
  useEffect(() => {
    if (cyRef.current && focusNodeId) {
      const target = cyRef.current.getElementById(focusNodeId);
      if (target.length > 0) {
        cyRef.current.animate({
          center: { eles: target },
          zoom: 1.6,
          duration: 400
        });
        target.select();
      }
    }
  }, [focusNodeId]);

  const toggleFilter = (type: string) => {
    setActiveFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 50);
  const handleResetLayout = () => {
    cyRef.current?.layout({ name: activeLayout, animate: true, padding: 60 }).run();
  };

  const highlightShortestPath = () => {
    if (!cyRef.current || !shortestPathSource || !shortestPathTarget) return;
    cyRef.current.elements().removeClass('highlighted-path');
    const aStar = cyRef.current.elements().aStar({
      root: `#${shortestPathSource}`,
      goal: `#${shortestPathTarget}`
    });
    if (aStar.found) {
      aStar.path.addClass('highlighted-path');
      cyRef.current.fit(aStar.path, 70);
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-50 flex flex-col shadow-card">
      {/* Graph Control Toolbar (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-2 shadow-floating text-xs text-slate-700">
        {/* Zoom & Fit buttons */}
        <div className="flex items-center border-r border-slate-200 pr-2 gap-1">
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleFit} className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition" title="Fit Screen">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button onClick={handleResetLayout} className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition" title="Re-run Layout">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2">
          <span className="text-[10px] text-slate-500 font-mono font-bold">LAYOUT:</span>
          {(['cose', 'concentric', 'circle'] as const).map((layout) => (
            <button
              key={layout}
              onClick={() => setActiveLayout(layout)}
              className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition ${
                activeLayout === layout 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {layout}
            </button>
          ))}
        </div>

        {/* Entity Filters */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
          {[
            { key: 'person', label: 'Persons', color: 'bg-blue-600' },
            { key: 'phone', label: 'Phones', color: 'bg-emerald-600' },
            { key: 'vehicle', label: 'Vehicles', color: 'bg-amber-600' },
            { key: 'bank_account', label: 'Banks', color: 'bg-rose-600' },
            { key: 'location', label: 'Locations', color: 'bg-purple-600' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5 transition border ${
                activeFilters[key]
                  ? 'bg-slate-50 border-slate-300 text-slate-800 font-bold shadow-xs'
                  : 'bg-white border-dashed border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shortest Path Finder Toolbar (Bottom-Left overlay) */}
      {elements.nodes.length >= 2 && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-2.5 shadow-floating text-xs">
          <Navigation className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-600 uppercase font-bold">Shortest Conduit:</span>
          <select 
            value={shortestPathSource}
            onChange={(e) => setShortestPathSource(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="">Source Node...</option>
            {elements.nodes.map((n) => (
              <option key={n.data.id} value={n.data.id}>
                {n.data.label} ({n.data.type})
              </option>
            ))}
          </select>
          <span className="text-slate-400 font-bold">→</span>
          <select 
            value={shortestPathTarget}
            onChange={(e) => setShortestPathTarget(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
          >
            <option value="">Target Node...</option>
            {elements.nodes.map((n) => (
              <option key={n.data.id} value={n.data.id}>
                {n.data.label} ({n.data.type})
              </option>
            ))}
          </select>
          <button
            onClick={highlightShortestPath}
            disabled={!shortestPathSource || !shortestPathTarget}
            className="px-3 py-1 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition text-xs shadow-xs"
          >
            Trace Conduit
          </button>
        </div>
      )}

      {/* Canvas Mount Target */}
      <div ref={containerRef} className="cytoscape-container w-full h-full flex-1" />
    </div>
  );
};

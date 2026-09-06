import { useState } from 'react';

function NetworkGraph() {
  const [activePreset, setActivePreset] = useState('cycle');
  const [selectedNode, setSelectedNode] = useState(null);

  // Nodes for AML Graph
  const nodes = [
    { id: 'ACC034', x: 180, y: 110, role: 'Mule Ring Leader', risk: 94, type: 'mule' },
    { id: 'ACC052', x: 380, y: 110, role: 'Layering Account', risk: 91, type: 'mule' },
    { id: 'ACC089', x: 280, y: 270, role: 'Cash-out Mule', risk: 88, type: 'mule' },
    { id: 'ACC012', x: 80,  y: 220, role: 'Originator / Smurf', risk: 42, type: 'normal' },
    { id: 'ACC060', x: 480, y: 220, role: 'External Beneficiary', risk: 35, type: 'normal' },
    { id: 'ACC057', x: 280, y: 40,  role: 'Structuring Source', risk: 79, type: 'suspicious' },
  ];

  // Directed edges (Money flows)
  const edges = [
    // The Circular Mule Loop: ACC034 -> ACC052 -> ACC089 -> ACC034
    { from: 'ACC034', to: 'ACC052', amount: '₹48,500', isSuspicious: true, label: 'Loop Step 1' },
    { from: 'ACC052', to: 'ACC089', amount: '₹47,900', isSuspicious: true, label: 'Loop Step 2' },
    { from: 'ACC089', to: 'ACC034', amount: '₹46,800', isSuspicious: true, label: 'Loop Step 3 (Cycle Complete)' },
    // Ancillary transfers
    { from: 'ACC012', to: 'ACC034', amount: '₹12,000', isSuspicious: false, label: 'Inflow' },
    { from: 'ACC052', to: 'ACC060', amount: '₹5,000',  isSuspicious: false, label: 'Outflow' },
    { from: 'ACC057', to: 'ACC052', amount: '₹30,000', isSuspicious: true,  label: 'Structuring' },
  ];

  const filteredEdges = activePreset === 'cycle'
    ? edges.filter(e => ['ACC034', 'ACC052', 'ACC089'].includes(e.from) && ['ACC034', 'ACC052', 'ACC089'].includes(e.to))
    : edges;

  const getNode = (id) => nodes.find(n => n.id === id);

  return (
    <div className="network-graph-card">
      <div className="graph-header">
        <div>
          <h3>Mule Ring Topology & Flow Visualizer</h3>
          <span className="section-subtitle">Interactive visual graph of detected circular flows and smurfing layers</span>
        </div>
        <div className="graph-controls">
          <button
            className={`chip-btn ${activePreset === 'cycle' ? 'active' : ''}`}
            onClick={() => { setActivePreset('cycle'); setSelectedNode(null); }}
          >
            🔄 Highlight Cycle Ring
          </button>
          <button
            className={`chip-btn ${activePreset === 'all' ? 'active' : ''}`}
            onClick={() => { setActivePreset('all'); setSelectedNode(null); }}
          >
            🌐 View Full Network
          </button>
        </div>
      </div>

      <div className="graph-workspace">
        <svg className="graph-svg" viewBox="0 0 560 320">
          <defs>
            <marker
              id="arrow-red"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>
            <marker
              id="arrow-blue"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Render directed edges */}
          {filteredEdges.map((edge, idx) => {
            const src = getNode(edge.from);
            const dst = getNode(edge.to);
            if (!src || !dst) return null;

            const midX = (src.x + dst.x) / 2;
            const midY = (src.y + dst.y) / 2;

            return (
              <g key={idx} className="edge-group">
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={dst.x}
                  y2={dst.y}
                  className={`graph-edge ${edge.isSuspicious ? 'edge-suspicious' : 'edge-normal'}`}
                  markerEnd={edge.isSuspicious ? 'url(#arrow-red)' : 'url(#arrow-blue)'}
                />
                <rect
                  x={midX - 30}
                  y={midY - 9}
                  width="60"
                  height="16"
                  rx="3"
                  className="edge-label-bg"
                />
                <text x={midX} y={midY + 3} className="edge-text">
                  {edge.amount}
                </text>
              </g>
            );
          })}

          {/* Render nodes */}
          {nodes.map((node) => {
            const isDimmed = activePreset === 'cycle' && !['ACC034', 'ACC052', 'ACC089'].includes(node.id);
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                className={`node-group ${isDimmed ? 'node-dimmed' : ''}`}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer halo for high risk mules */}
                {node.type === 'mule' && !isDimmed && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    className="node-halo-pulse"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="16"
                  className={`node-circle ${
                    node.type === 'mule'
                      ? 'node-mule'
                      : node.type === 'suspicious'
                      ? 'node-suspicious'
                      : 'node-normal'
                  } ${isSelected ? 'node-selected' : ''}`}
                />
                <text x={node.x} y={node.y + 30} className="node-label">
                  {node.id}
                </text>
                <text x={node.x} y={node.y + 4} className="node-icon-text">
                  {node.type === 'mule' ? '⚠' : '₹'}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Sidebar Overlay */}
        <div className="graph-sidebar">
          {selectedNode ? (
            <div className="node-detail-box">
              <div className="node-detail-header">
                <span className="font-bold">{selectedNode.id}</span>
                <span className={`risk-badge ${selectedNode.risk >= 85 ? 'risk-critical' : 'risk-high'}`}>
                  Risk: {selectedNode.risk}
                </span>
              </div>
              <p className="node-role-text">{selectedNode.role}</p>
              <div className="node-metric">
                <span>Classification:</span>
                <span style={{ color: selectedNode.type === 'mule' ? '#ef4444' : '#38bdf8', fontWeight: 600 }}>
                  {selectedNode.type.toUpperCase()}
                </span>
              </div>
              <div className="node-actions">
                <button className="btn-action" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Drill Into Ledger
                </button>
              </div>
            </div>
          ) : (
            <div className="node-detail-hint">
              <p>💡 Click any account node on the graph to inspect risk profile and link structure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NetworkGraph;

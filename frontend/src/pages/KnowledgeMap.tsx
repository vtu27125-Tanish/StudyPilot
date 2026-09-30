import { useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Machine Learning Basics' }, style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '15px' } },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'Gradient Descent' }, style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '15px' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'Neural Networks' }, style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '15px' } },
  { id: '4', position: { x: 400, y: 280 }, data: { label: 'Backpropagation' }, style: { background: '#1e293b', color: '#fff', border: '1px solid #8b5cf6', borderRadius: '8px', padding: '15px' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#60a5fa' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#60a5fa' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#8b5cf6' } },
];

export default function KnowledgeMap() {
  const [nodes] = useState(initialNodes);
  const [edges] = useState(initialEdges);

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-white">Visual Knowledge Map</h2>
      <div className="flex-1 glass-card rounded-3xl overflow-hidden shadow-2xl relative">
        <ReactFlow nodes={nodes} edges={edges} fitView className="bg-slate-900/50">
          <Background color="#334155" gap={20} />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-300" />
        </ReactFlow>
      </div>
    </div>
  );
}

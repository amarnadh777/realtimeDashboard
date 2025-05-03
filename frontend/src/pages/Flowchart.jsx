import React, { useCallback, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AuthContext } from '../context/authContext';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Start Node' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Middle Node' }, position: { x: 100, y: 100 } },
  { id: '3', type: 'output', data: { label: 'End Node' }, position: { x: 250, y: 200 } }
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' }
];

function FlowchartContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const reactFlowInstance = useReactFlow();

     const {user} = useContext(AuthContext);

  
  useEffect(() => {
    const fetchFlow = async () => {
      try {
        const response = await axios.post('http://localhost:3000/flow/fetch',{
            email:user.email
        });
        const data = response.data;
        console.log(data.flow.nodes)
        setNodes(data.flow.nodes);
        setEdges(data.flow.edges);
      } catch (error) {
        console.error('Error fetching flow data:', error);
      }
    };
    fetchFlow();
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      setNodes((nds) => nds.map((n) => n.id === node.id ? { ...n, position: node.position } : n));
    },
    [setNodes]
  );

  const onDelete = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    }
  }, [selectedNodeId, selectedEdgeId, setNodes, setEdges]);

  const openAddNodeModal = () => {
    setIsModalOpen(true);
  };

  const confirmAddNode = () => {
    const newNodeId = (nodes.length + 1).toString();
    const nodeLabel = newNodeName || `Node ${newNodeId}`;

    const newNode = {
      id: newNodeId,
      data: { label: nodeLabel },
      position: { x: Math.random() * 200, y: Math.random() * 400 },
    };

    setNodes((nds) => [...nds, newNode]);

    if (selectedNodeId) {
      const newEdge = { id: `e${selectedNodeId}-${newNodeId}`, source: selectedNodeId, target: newNodeId };
      setEdges((eds) => [...eds, newEdge]);
    }

    setNewNodeName('');
    setIsModalOpen(false);
  };

  const saveFlow = async () => {
    try {
      const response = await axios.post('http://localhost:3000/flow/create', {
        email: user.email,
        nodes,
        edges
      });
      if (response.status === 200) {
        alert('Flow saved successfully!');
      } else {
        alert(`Failed to save flow: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Save flow error:', error);
      alert('An error occurred while saving the flow.');
    }
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={(elements) => {
          const nodeId = elements.nodes[0]?.id || null;
          const edgeId = elements.edges[0]?.id || null;
          setSelectedNodeId(nodeId);
          setSelectedEdgeId(edgeId);
        }}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <div style={{ position: 'absolute', top: 70, right: 20, display: 'flex', gap: '10px' }}>
        <button
          onClick={onDelete}
          style={{ padding: '8px 12px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Delete Selected
        </button>

        <button
          onClick={openAddNodeModal}
          style={{ padding: '8px 12px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Node
        </button>

        <button
          onClick={saveFlow}
          style={{ padding: '8px 12px', background: '#0275d8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Save Flow
        </button>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '8px',
            width: '300px', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <h3 style={{ margin: 0 }}>Enter Node Name</h3>
            <input
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              placeholder="Node label"
              style={{ padding: '8px', fontSize: '14px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '8px 12px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAddNode}
                style={{ padding: '8px 12px', background: '#5cb85c', color: '#fff', border: 'none', borderRadius: '4px' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Flowchart() {
  return (
    <div>
      <Navbar />
      <ReactFlowProvider>
        <FlowchartContent />
      </ReactFlowProvider>
    </div>
  );
}

export default Flowchart;

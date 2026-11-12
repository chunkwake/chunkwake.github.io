'use client';

import { useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  NodeToolbar,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { SiteCopy } from '@/lib/dictionary';

type ArchNodeData = {
  label: string;
  tip: string;
  tone?: 'hot' | 'muted';
  tipPosition?: Position.Top | Position.Bottom;
};

type ArchNode = Node<ArchNodeData, 'arch'>;

function ArchNodeView({ data }: NodeProps<ArchNode>) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <NodeToolbar
        isVisible={hovered}
        position={data.tipPosition ?? Position.Bottom}
        offset={8}
        className="cw-flow-toolbar"
      >
        <div className="cw-flow-tooltip">{data.tip}</div>
      </NodeToolbar>

      <div
        className={`cw-flow-node${data.tone === 'hot' ? ' cw-flow-node-hot' : ''}${
          data.tone === 'muted' ? ' cw-flow-node-muted' : ''
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        tabIndex={0}
      >
        {data.label}
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </>
  );
}

const nodeTypes = { arch: ArchNodeView };

const edgeStyle = { stroke: '#454542', strokeWidth: 1.2 };
const markerEnd = { type: MarkerType.ArrowClosed, color: '#555550', width: 12, height: 12 };

export function ArchitectureFlow({ nodes: copyNodes }: { nodes: SiteCopy['architecture']['nodes'] }) {
  const nodes: ArchNode[] = [
    {
      id: 'client',
      type: 'arch',
      position: { x: 150, y: 0 },
      data: { label: copyNodes.client.label, tip: copyNodes.client.tip },
    },
    {
      id: 'net',
      type: 'arch',
      position: { x: 150, y: 64 },
      data: { label: copyNodes.net.label, tip: copyNodes.net.tip, tone: 'hot' },
    },
    {
      id: 'world',
      type: 'arch',
      position: { x: 0, y: 128 },
      data: { label: copyNodes.world.label, tip: copyNodes.world.tip },
    },
    {
      id: 'mechanics',
      type: 'arch',
      position: { x: 250, y: 128 },
      data: { label: copyNodes.mechanics.label, tip: copyNodes.mechanics.tip },
    },
    {
      id: 'bridge',
      type: 'arch',
      position: { x: 135, y: 192 },
      data: { label: copyNodes.bridge.label, tip: copyNodes.bridge.tip, tone: 'hot' },
    },
    {
      id: 'jvm',
      type: 'arch',
      position: { x: 135, y: 256 },
      data: { label: copyNodes.jvm.label, tip: copyNodes.jvm.tip },
    },
    {
      id: 'plugins',
      type: 'arch',
      position: { x: 135, y: 320 },
      data: {
        label: copyNodes.plugins.label,
        tip: copyNodes.plugins.tip,
        tone: 'muted',
        tipPosition: Position.Top,
      },
    },
  ];

  const edges: Edge[] = [
    { id: 'c-n', source: 'client', target: 'net' },
    { id: 'n-w', source: 'net', target: 'world' },
    { id: 'n-m', source: 'net', target: 'mechanics' },
    { id: 'w-b', source: 'world', target: 'bridge' },
    { id: 'm-b', source: 'mechanics', target: 'bridge' },
    { id: 'b-j', source: 'bridge', target: 'jvm' },
    { id: 'j-p', source: 'jvm', target: 'plugins' },
  ].map((edge) => ({
    ...edge,
    type: 'smoothstep',
    style: edgeStyle,
    markerEnd,
  }));

  return (
    <div className="cw-flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.14, maxZoom: 1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        preventScrolling={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#2a2a2a" />
      </ReactFlow>
    </div>
  );
}

import React from "react";

export default function FolderNode({ node, expanded, checked, handleToggle, handleCheck, renderChildren }) {
  return (
    <div data-testid={`node-${node.id}`} className="node">
      {node.children && (
        <button
          data-testid={`toggle-${node.id}`}
          onClick={() => handleToggle(node.id)}
          className="toggle-btn"
        >
          {expanded[node.id] ? "▼" : "▶"}
        </button>
      )}
      <input
        type="checkbox"
        data-testid={`checkbox-${node.id}`}
        checked={!!checked[node.id]}
        onChange={(e) => handleCheck(node, e.target.checked)}
      />
      <span className="node-label">{node.name}</span>
      {node.children && expanded[node.id] && (
        <div className="children">{node.children.map(renderChildren)}</div>
      )}
    </div>
  );
}

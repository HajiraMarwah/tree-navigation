import React, { useState, useCallback } from "react";
import "./FolderTree.css"; // Import CSS

function FolderTree({ data }) {
  const [expanded, setExpanded] = useState({});
  const [checked, setChecked] = useState({});

  const handleToggle = useCallback((id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const getAllChildIds = useCallback((node) => {
    if (!node.children) return [node.id];
    return [node.id, ...node.children.flatMap(getAllChildIds)];
  }, []);

  const updateParentChecks = useCallback((node, updatedChecked) => {
    if (!node) return updatedChecked;
    if (node.children) {
      const allChecked = node.children.every(
        (child) => updatedChecked[child.id]
      );
      updatedChecked[node.id] = allChecked;
    }
    return updatedChecked;
  }, []);

  const handleCheck = useCallback(
    (node, isChecked) => {
      let updatedChecked = { ...checked };
      const childIds = getAllChildIds(node);
      childIds.forEach((id) => {
        updatedChecked[id] = isChecked;
      });

      const updateParentsRecursive = (targetNode, currentData) => {
        const findParent = (nodes, childId) => {
          for (let n of nodes) {
            if (n.children?.some((c) => c.id === childId)) return n;
            const found = findParent(n.children || [], childId);
            if (found) return found;
          }
          return null;
        };
        const parentNode = findParent(data, targetNode.id);
        if (parentNode) {
          updatedChecked = updateParentChecks(parentNode, updatedChecked);
          updateParentsRecursive(parentNode, data);
        }
      };
      updateParentsRecursive(node, data);

      setChecked(updatedChecked);
    },
    [checked, data, getAllChildIds, updateParentChecks]
  );

  const renderNode = (node) => (
    <div key={node.id} data-testid={`node-${node.id}`} className="node">
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
        <div className="children">{node.children.map(renderNode)}</div>
      )}
    </div>
  );

  return (
    <div className="tree-container" data-testid="tree-container">
      <h3 className="title">Folder Navigation</h3>
      {data.map(renderNode)}
    </div>
  );
}

export default FolderTree;

import React, { useState, useCallback } from "react";

function FolderTree({ data }) {
  const [expanded, setExpanded] = useState({});
  const [checked, setChecked] = useState({});

  // Toggle expand/collapse for a folder
  const handleToggle = useCallback((id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Recursive function to get all children IDs
  const getAllChildIds = useCallback((node) => {
    if (!node.children) return [node.id];
    return [node.id, ...node.children.flatMap(getAllChildIds)];
  }, []);

  // Update parent checkbox state based on children
  const updateParentChecks = useCallback(
    (node, updatedChecked) => {
      if (!node) return updatedChecked;
      if (node.children) {
        const allChecked = node.children.every(
          (child) => updatedChecked[child.id]
        );
        updatedChecked[node.id] = allChecked;
      }
      return updatedChecked;
    },
    []
  );

  // Handle checkbox change
  const handleCheck = useCallback(
    (node, isChecked) => {
      let updatedChecked = { ...checked };
      const childIds = getAllChildIds(node);
      childIds.forEach((id) => {
        updatedChecked[id] = isChecked;
      });

      // Update parents recursively
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

  // Recursive renderer
  const renderNode = (node) => (
    <div
      key={node.id}
      data-testid={`node-${node.id}`}
      style={{ paddingLeft: "20px" }}
    >
      {node.children && (
        <button
          data-testid={`toggle-${node.id}`}
          onClick={() => handleToggle(node.id)}
          style={{
            marginRight: "5px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
          }}
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
      {node.name}
      {node.children && expanded[node.id] && (
        <div>{node.children.map(renderNode)}</div>
      )}
    </div>
  );

  return (
    <div data-testid="tree-container">
      <h3>Folder Navigation</h3>
      {data.map(renderNode)}
    </div>
  );
}

export default FolderTree;

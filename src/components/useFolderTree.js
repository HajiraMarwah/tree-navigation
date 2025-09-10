import { useState, useCallback } from "react";

export default function useFolderTree(data) {
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

      const updateParentsRecursive = (targetNode) => {
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
          updateParentsRecursive(parentNode);
        }
      };
      updateParentsRecursive(node);

      setChecked(updatedChecked);
    },
    [checked, data, getAllChildIds, updateParentChecks]
  );

  return { expanded, checked, handleToggle, handleCheck };
}

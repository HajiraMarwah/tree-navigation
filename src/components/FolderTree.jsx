import React from "react";
import useFolderTree from "./useFolderTree";
import FolderNode from "./FolderNode";
import "./FolderTree.css";

export default function FolderTree({ data }) {
  const { expanded, checked, handleToggle, handleCheck } = useFolderTree(data);

  const renderNode = (node) => (
    <FolderNode
      key={node.id}
      node={node}
      expanded={expanded}
      checked={checked}
      handleToggle={handleToggle}
      handleCheck={handleCheck}
      renderChildren={renderNode}
    />
  );

  return (
    <div className="tree-container" data-testid="tree-container">
      <h3 className="title">Folder Navigation</h3>
      {data.map(renderNode)}
    </div>
  );
}

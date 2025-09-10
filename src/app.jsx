import React from "react";
import FolderTree from "./components/FolderTree";
import treeData from "./data/treeData";


export default function App() {
  return (
    <div>
      <FolderTree data={treeData} />
    </div>
  );
}

import React from "react";
import FolderTree from "./components/FolderTree";

const treeData = [
  {
    id: 1,
    name: "Folder 1",
    children: [
      { id: 2, name: "File 1-1" },
      {
        id: 3,
        name: "Subfolder 1-2",
        children: [{ id: 4, name: "File 1-2-1" }],
      },
    ],
  },
  {
    id: 5,
    name: "Folder 2",
    children: [{ id: 6, name: "File 2-1" }],
  },
];

export default function App() {
  return (
    <div>
      <FolderTree data={treeData} />
    </div>
  );
}

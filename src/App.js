import React, { useState } from "react";
import * as XLSX from "xlsx";

const cameraPartsData = {
  "Camera A": {
    Ceiling: [
      { name: "Mounting Bracket A", partNumber: "MB-A123", description: "Standard ceiling mount for Camera A" },
      { name: "Screw Set A", partNumber: "SS-A456", description: "Includes all necessary screws for ceiling install" },
    ],
    Wall: [
      { name: "Wall Bracket A", partNumber: "WB-A789", description: "Standard wall bracket for Camera A" },
    ],
  },
  "Camera B": {
    Ceiling: [
      { name: "Mounting Bracket B", partNumber: "MB-B123", description: "Ceiling bracket for Camera B" },
      { name: "Adapter Ring B", partNumber: "AR-B456", description: "Ring for adapting to drop ceilings" },
    ],
    Wall: [
      { name: "Wall Bracket B", partNumber: "WB-B789", description: "Wall bracket for Camera B" },
      { name: "Corner Mount B", partNumber: "CM-B321", description: "Corner mount adapter for Camera B" },
    ],
  },
};

function App() {
  const [cameraModel, setCameraModel] = useState("Camera A");
  const [mountType, setMountType] = useState("Ceiling");
  const [quantity, setQuantity] = useState(1);
  const [queue, setQueue] = useState([]);

  const addToQueue = () => {
    setQueue((prev) => [
      ...prev,
      { cameraModel, mountType, quantity: parseInt(quantity) },
    ]);
  };

  const removeFromQueue = (index) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  const exportToExcel = () => {
    let rows = [];
    queue.forEach(({ cameraModel, mountType, quantity }) => {
      const parts = cameraPartsData[cameraModel]?.[mountType] || [];
      parts.forEach((part) => {
        rows.push({
          "Camera Model": cameraModel,
          "Mount Type": mountType,
          "Quantity": quantity,
          "Part Name": part.name,
          "Part Number": part.partNumber,
          "Description": part.description,
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parts List");
    XLSX.writeFile(wb, "Axis_Parts_List.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Axis Parts Tool</h1>

      <label>Camera Model: </label>
      <select value={cameraModel} onChange={(e) => setCameraModel(e.target.value)}>
        {Object.keys(cameraPartsData).map((model) => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>

      <label style={{ marginLeft: 10 }}>Mount Type: </label>
      <select value={mountType} onChange={(e) => setMountType(e.target.value)}>
        <option value="Ceiling">Ceiling</option>
        <option value="Wall">Wall</option>
      </select>

      <label style={{ marginLeft: 10 }}>Quantity: </label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{ width: 60 }}
      />

      <button onClick={addToQueue} style={{ marginLeft: 10 }}>
        Add to List
      </button>

      <h3 style={{ marginTop: 30 }}>Queued Items</h3>
      <ul>
        {queue.map((item, index) => (
          <li key={index}>
            {item.quantity} x {item.cameraModel} ({item.mountType})
            <button onClick={() => removeFromQueue(index)} style={{ marginLeft: 10 }}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      {queue.length > 0 && (
        <button onClick={exportToExcel} style={{ marginTop: 20 }}>
          Export All to Excel
        </button>
      )}
    </div>
  );
}

export default App;

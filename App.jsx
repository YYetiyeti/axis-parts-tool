// Initial scaffold for the Axis Camera Parts Tool
// React + Tailwind + xlsx export (starter structure)

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const partsMatrix = {
  'P3737-PLE': {
    wall: ['T91D61 Wall Mount', 'AXIS Pendant Kit'],
    pole: ['T91A47 Pole Mount', 'T91D61 Wall Mount', 'Pendant Kit'],
    ceiling: ['T94T01L Recessed Mount'],
  },
  'Q6075-E': {
    wall: ['T91G61 Wall Mount'],
    pole: ['T91A47 Pole Mount', 'T91G61 Wall Mount'],
    parapet: ['T91B67 Parapet Mount'],
  },
  // Add more models and placements here...
};

const CameraPartsTool = () => {
  const [cameraModel, setCameraModel] = useState('');
  const [mountLocation, setMountLocation] = useState('');
  const [requiredParts, setRequiredParts] = useState([]);

  const handleSearch = () => {
    const parts = partsMatrix[cameraModel]?.[mountLocation] || [];
    setRequiredParts(parts);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      requiredParts.map((part) => ({ Part: part }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PartsList');
    const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([wbout]), 'PartsList.xlsx');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Axis Camera Parts Tool</h1>

      <label className="block mb-2">Camera Model:</label>
      <select
        value={cameraModel}
        onChange={(e) => setCameraModel(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      >
        <option value="">Select Model</option>
        {Object.keys(partsMatrix).map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>

      <label className="block mb-2">Mount Location:</label>
      <select
        value={mountLocation}
        onChange={(e) => setMountLocation(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      >
        <option value="">Select Location</option>
        <option value="wall">Wall</option>
        <option value="pole">Pole</option>
        <option value="ceiling">Ceiling</option>
        <option value="parapet">Parapet</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Show Required Parts
      </button>

      {requiredParts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Required Parts:</h2>
          <ul className="list-disc list-inside">
            {requiredParts.map((part, index) => (
              <li key={index}>{part}</li>
            ))}
          </ul>
          <button
            onClick={exportToExcel}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraPartsTool;

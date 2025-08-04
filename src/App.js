import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const App = () => {
  const [projectName, setProjectName] = useState('');
  const [projectNumber, setProjectNumber] = useState('');
  const [cameraModel, setCameraModel] = useState('');
  const [mountType, setMountType] = useState('Ceiling');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [queue, setQueue] = useState([]);

  const cameraParts = {
    'Q6010-E': [
      { partNumber: '01981-001', description: 'Q6010-E multiview camera' },
      { partNumber: '01752-004', description: 'Q6075-E PTZ' },
      { partNumber: '02411-001', description: 'TQ5001-E wall and pole mount' },
      { partNumber: 'CNFE1002MAC1A-M', description: 'NON-POE media converter – XCEL Stock' },
      { partNumber: 'CNFE1002M18', description: 'B side media converter (goes in headend)' },
    ],
    'Q3536-LVE': [
      { partNumber: '02051-001', description: 'Q3536-LVE camera' },
      { partNumber: '01165-001', description: 'T91B47 pole mount' },
      { partNumber: '5507-641', description: 'T91H61 wall mount' },
      { partNumber: '5505-091', description: 'T94M01D pendant kit' },
      { partNumber: 'CNFE1002PAOEM/M', description: 'POE fiber converter' },
      { partNumber: 'CNFE1002M18', description: 'B side media converter (goes in headend)' },
      { partNumber: 'PS-DRA60-48A', description: 'DIN rail power supply – XCEL Stock' },
    ],
    'P3737-PLE': [
      { partNumber: '02634-001', description: 'P3737-PLE multiview camera' },
      { partNumber: '01513-001', description: 'T94N01D pendant kit' },
      { partNumber: '5507-641', description: 'T91H61 wall mount' },
      { partNumber: '01470-001', description: 'T91B57 pole mount' },
      { partNumber: 'CNFE1002PAOEM/M', description: 'POE fiber converter' },
      { partNumber: 'CNFE1002M18', description: 'B side media converter – XCEL Stock' },
      { partNumber: 'PS-DRA60-48A', description: 'DIN rail power supply – XCEL Stock' },
    ],
  };

  const handleAddToQueue = () => {
    if (!cameraModel || !quantity || !location) return;
    const parts = cameraParts[cameraModel] || [];
    setQueue(prev => [...prev, { cameraModel, mountType, quantity, location, parts }]);
  };

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    queue.forEach((entry, index) => {
      const title = `${entry.location}`;
      const rows = [];

      entry.parts.forEach(part => {
        rows.push({
          Qty: entry.quantity,
          'Part Number': part.partNumber,
          Description: part.description,
        });
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31)); // Excel sheet names must be <=31 chars
    });

    XLSX.writeFile(wb, `${projectNumber}_${projectName}_Parts_List.xlsx`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Axis Parts Tool</h2>

      <div>
        <label>Project Name: </label>
        <input value={projectName} onChange={e => setProjectName(e.target.value)} /><br /><br />

        <label>Project Number: </label>
        <input value={projectNumber} onChange={e => setProjectNumber(e.target.value)} /><br /><br />

        <label>Camera Model: </label>
        <select value={cameraModel} onChange={e => setCameraModel(e.target.value)}>
          <option value="">Select</option>
          {Object.keys(cameraParts).map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select><br /><br />

        <label>Mount Type: </label>
        <select value={mountType} onChange={e => setMountType(e.target.value)}>
          <option value="Ceiling">Ceiling</option>
          <option value="Pole">Pole</option>
          <option value="External Corner">External Corner</option>
          <option value="Parapet">Parapet</option>
        </select><br /><br />

        <label>Quantity: </label>
        <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} /><br /><br />

        <label>Location: </label>
        <input value={location} onChange={e => setLocation(e.target.value)} /><br /><br />

        <button onClick={handleAddToQueue}>Add to Queue</button>
        <button onClick={handleExport} style={{ marginLeft: '10px' }}>Export to Excel</button>
      </div>

      <hr />

      <h3>Queued Configurations</h3>
      <ul>
        {queue.map((entry, idx) => (
          <li key={idx}>
            <strong>{entry.location}</strong> — {entry.quantity}x {entry.cameraModel} ({entry.mountType})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

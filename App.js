import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';

const data = {
  'Camera A': {
    'Ceiling': ['Screw A', 'Bracket B'],
    'Wall': ['Screw C', 'Bracket D']
  },
  'Camera B': {
    'Ceiling': ['Anchor X', 'Mount Y'],
    'Wall': ['Anchor Z']
  }
};

function App() {
  const [camera, setCamera] = useState('');
  const [mount, setMount] = useState('');

  const handleExport = () => {
    const parts = data[camera]?.[mount] || [];
    const ws = utils.json_to_sheet(parts.map((part, i) => ({ "#": i + 1, Part: part })));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Parts List");
    writeFile(wb, "parts-list.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Axis Parts Tool</h1>
      <div>
        <label>Camera Model:</label>
        <select onChange={(e) => setCamera(e.target.value)} value={camera}>
          <option value="">-- Select --</option>
          {Object.keys(data).map((cam) => (
            <option key={cam} value={cam}>{cam}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Mount Type:</label>
        <select onChange={(e) => setMount(e.target.value)} value={mount} disabled={!camera}>
          <option value="">-- Select --</option>
          {camera && Object.keys(data[camera]).map((mt) => (
            <option key={mt} value={mt}>{mt}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleExport} disabled={!camera || !mount}>
          Export Parts to Excel
        </button>
      </div>
    </div>
  );
}

export default App;

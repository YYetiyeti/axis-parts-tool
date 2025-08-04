import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const CAMERA_PARTS = {
  'Q6010-E': {
    Ceiling: [
      { qty: 1, partNumber: '01981-001', description: 'Q6010-E multiview camera' },
      { qty: 1, partNumber: '01752-004', description: 'Q6075-E PTZ' },
      { qty: 1, partNumber: '02411-001', description: 'TQ5001-E wall and pole mount' },
      { qty: 1, partNumber: 'CNFE1002MAC1A-M', description: 'NON-POE media converter – XCEL Stock' },
      { qty: 1, partNumber: 'CNFE1002M1B', description: 'B side media converter (goes in headend)' }
    ]
  },
  'Q3536-LVE': {
    Pole: [
      { qty: 1, partNumber: '02051-001', description: 'Q3536-LVE camera' },
      { qty: 1, partNumber: '01165-001', description: 'T91B47 pole mount' },
      { qty: 1, partNumber: '5507-641', description: 'T91H61 wall mount' },
      { qty: 1, partNumber: '5505-091', description: 'T94M01D pendant kit' },
      { qty: 1, partNumber: 'CNFE1002APOEM/M', description: 'POE fiber converter' },
      { qty: 1, partNumber: 'CNFE1002M1B', description: 'B side media converter (goes in headend)' },
      { qty: 1, partNumber: 'PS-DRA60-48A', description: 'DIN rail power supply – XCEL Stock' }
    ]
  }
  // Add more models and mount types as needed
};

export default function AxisPartsTool() {
  const [projectName, setProjectName] = useState('');
  const [projectNumber, setProjectNumber] = useState('');
  const [model, setModel] = useState('Q6010-E');
  const [mount, setMount] = useState('Ceiling');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [queue, setQueue] = useState([]);

  const addToQueue = () => {
    setQueue([...queue, { model, mount, quantity, location }]);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [];

    ws_data.push([`Project Name: ${projectName}`]);
    ws_data.push([`Project Number: ${projectNumber}`]);
    ws_data.push([]);
    ws_data.push(['Parts List Breakdown']);

    queue.forEach(({ model, mount, quantity, location }, index) => {
      const header = [`${location || 'Location ' + (index + 1)}`];
      ws_data.push([]);
      ws_data.push(header);
      ws_data.push(['Qty.', 'Part Number', 'Description']);
      const parts = CAMERA_PARTS[model]?.[mount] || [];

      parts.forEach(part => {
        ws_data.push([part.qty * quantity, part.partNumber, part.description]);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Parts');
    XLSX.writeFile(wb, 'Axis_Parts_List.xlsx');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Axis Parts Tool</h1>
      <div>
        <label>Project Name: </label>
        <input value={projectName} onChange={e => setProjectName(e.target.value)} />
      </div>
      <div>
        <label>Project Number: </label>
        <input value={projectNumber} onChange={e => setProjectNumber(e.target.value)} />
      </div>
      <div>
        <label>Camera Model: </label>
        <select value={model} onChange={e => setModel(e.target.value)}>
          {Object.keys(CAMERA_PARTS).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label>Mount Type: </label>
        <select value={mount} onChange={e => setMount(e.target.value)}>
          {Object.keys(CAMERA_PARTS[model] || {}).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label>Quantity: </label>
        <input type="number" min="1" value={quantity} onChange={e => setQuantity(+e.target.value)} />
      </div>
      <div>
        <label>Location: </label>
        <input value={location} onChange={e => setLocation(e.target.value)} />
      </div>
      <button onClick={addToQueue}>Add to Queue</button>
      <button onClick={exportToExcel}>Export Parts to Excel</button>
    </div>
  );
}

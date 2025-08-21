// src/ModuleCalendar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from './api';
import Calendar from 'react-calendar';
import { Modal, Button, Form, Badge, Table } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import './ModuleCalendar.css'; // Your overrides

export default function ModuleCalendar() {
  const { id } = useParams(); // moduleId
  const [moduleInfo, setModuleInfo] = useState(null);
  const [values, setValues] = useState([]); // [{id,date,value}]
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const dateKey = (d) => d.toISOString().split('T')[0];
  const mapByDate = useMemo(() => {
    const m = {};
    values.forEach(v => { m[v.date] = v; });
    return m;
  }, [values]);

  const load = async () => {
    const mRes = await fetch(`${API_BASE}/modules/${id}`);
    setModuleInfo(await mRes.json());
    const vRes = await fetch(`${API_BASE}/modules/${id}/values`);
    setValues(await vRes.json());
  };

  useEffect(()=>{ load(); }, [id]);

  const openForDate = (d) => {
    setSelectedDate(d);
    const key = dateKey(d);
    setInputValue(mapByDate[key]?.value ?? '');
    setShow(true);
  };

  const save = async () => {
    const body = { date: dateKey(selectedDate), value: inputValue===''? null : parseInt(inputValue,10) };
   
    await fetch(`${API_BASE}/modules/${id}/values`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    setShow(false); load();
  };

  const removeByDate = async () => {
    await fetch(`${API_BASE}/modules/${id}/values/by-date/${dateKey(selectedDate)}`, { method: 'DELETE' });
    setShow(false); load();
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const v = mapByDate[dateKey(date)];
    if (!v || v.value === null || v.value === undefined) {
      const safeValue = '**';
  return (
    <div className="mt-1">
      <Badge bg="primary" pill>{safeValue}</Badge>
    </div>
  );
    }
   
   const sortedValues = [...values].sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);      
  // Start from 1 day before current date
let prevDate = new Date(date);
let prevValue = null;

while (true) {
  prevDate.setDate(prevDate.getDate() - 1);  // go 1 day back
  const prevKey = dateKey(prevDate);
  const candidate = mapByDate[prevKey]?.value;

  if (candidate !== null && candidate !== undefined) {
    prevValue = candidate;
    break; // found previous non-null value
  }

  // Stop if we’ve gone too far (e.g., before the earliest value)
  if (prevDate < new Date(2000, 0, 1)) { // arbitrary safety cutoff
    break;
  }
}   

// --- split into fn and sn ---
let fn = null;
let sn = null;
let fncov = null;
let sncov = null;
let fnint = null;
let snint = null;

if (v.value !== null) {
  const str = v.value.toString().padStart(2, '0'); // ensures at least 2 digits
  fn = str[0];
  sn = str[1];
  fncov = parseInt(fn,10);
  sncov = parseInt(sn,10);
  fnint = ( fncov + 4) > 9 ? (fncov + 4)%10:(fncov + 4) ;
  snint = (sncov + 2) > 9 ? (sncov + 2)%10:(sncov + 2) ;
}

let pfn = null;
let psn = null;
let pfncov = null;
let psncov = null;
let pfnint = null;
let psnint = null;

if (prevValue !== null) {
  const str = prevValue.toString().padStart(2, '0'); // ensures at least 2 digits
  pfn = str[0];
  psn = str[1];
  pfncov = parseInt(pfn,10);
  psncov = parseInt(psn,10);
  pfnint = ( pfncov + 4) > 9 ? (pfncov + 4)%10:(pfncov + 4) ;
  psnint = (psncov + 2) > 9 ? (psncov + 2)%10:(psncov + 2) ;
}


   
  
    return <div className="mt-1 d-flex flex-wrap align-items-start justify-content-center badge-container">
      <Badge pill className="bg-warning text-white">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
     <span 
  style={{ 
    color: (fncov === pfnint 
          || fncov === psnint 
          || fncov === (pfnint >= 5 ? pfnint - 5 : pfnint + 5) 
          || fncov === (psnint >= 5 ? psnint - 5 : psnint + 5)) 
      ? 'green' 
      : 'red', 
    fontSize: '12px' 
  }}
>
  {(fncov === pfnint 
    || fncov === psnint 
    || fncov === (pfnint >= 5 ? pfnint - 5 : pfnint + 5) 
    || fncov === (psnint >= 5 ? psnint - 5 : psnint + 5)) 
      ? '✔' 
      : '✘'}
</span>
     <span 
  style={{ 
    color: (sncov === pfnint 
          || sncov === psnint 
          || sncov === (pfnint > 5 ? pfnint - 5 : pfnint + 5) 
          || sncov === (psnint > 5 ? psnint - 5 : psnint + 5)) 
      ? 'green' 
      : 'red', 
    fontSize: '12px' 
  }}
>
  {(sncov === pfnint 
    || sncov === psnint 
    || sncov === (pfnint > 5 ? pfnint - 5 : pfnint + 5) 
    || sncov === (psnint > 5 ? psnint - 5 : psnint + 5)) 
      ? '✔' 
      : '✘'}
</span>
      
    </div>
  </Badge>
  <Badge bg="primary" pill className="mb-1">
    
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {v.value > 9 ? v.value : `0${v.value}`}
    </div>
    </Badge>
    
  <Badge pill className="bg-dark text-white">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span>{fnint}</span>
      <span>{snint}</span>
      <span>{fnint >= 5 ? fnint-5 : fnint+5}</span>
      <span>{snint >= 5 ? snint-5 : snint+5}</span>
    </div>
  </Badge>
</div>;
  }
 
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="m-0">{moduleInfo ? moduleInfo.name : 'Module'}</h3>
          <div className="text-muted">{moduleInfo?.description}</div>
        </div>
        <Link to="/"><Button variant="secondary">← Back to Modules</Button></Link>
      </div>

      <div className="d-flex justify-content-center mb-4">
        <div className="border rounded p-3 shadow-sm bg-light">
          <Calendar
            onClickDay={openForDate}
            value={selectedDate}
            tileContent={tileContent}
          />
        </div>
      </div>

     

      <Modal show={show} onHide={()=>setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Value for {dateKey(selectedDate)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Number</Form.Label>
              <Form.Control
                type="number"
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                placeholder="Enter a number (or leave empty to clear)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {mapByDate[dateKey(selectedDate)] && (
            <Button variant="danger" onClick={removeByDate}>Delete</Button>
          )}
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

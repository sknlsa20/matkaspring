// src/ModuleList.jsx
import React, { useEffect, useState } from 'react';
import { API_BASE } from './api';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Table } from 'react-bootstrap';

export default function ModuleList() {
  const [modules, setModules] = useState([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const nav = useNavigate();

  const load = async () => {
    const res = await fetch(`${API_BASE}/modules`);
    setModules(await res.json());
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit(null); setForm({ name: '', description: '' }); setShow(true); };
  const openEdit = (m) => { setEdit(m); setForm({ name: m.name, description: m.description }); setShow(true); };

  const save = async () => {
    const method = edit ? 'PUT' : 'POST';
    const url = edit ? `${API_BASE}/modules/${edit.id}` : `${API_BASE}/modules`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShow(false); load();
  };

  const remove = async (id) => {
    await fetch(`${API_BASE}/modules/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Modules</h3>
        <Button onClick={openAdd}>Add Module</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr><th>#</th><th>Name</th><th>Description</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {modules.map((m, i) => (
            <tr key={m.id}>
              <td>{i+1}</td>
              <td>{m.name}</td>
              <td>{m.description}</td>
              <td className="d-flex gap-2">
                <Button size="sm" variant="primary" onClick={() => nav(`/modules/${m.id}`)}>Open Calendar</Button>
                <Button size="sm" variant="warning" onClick={() => openEdit(m)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => remove(m.id)}>Delete</Button>
              </td>
            </tr>
          ))}
          {modules.length===0 && <tr><td colSpan={4} className="text-center">No modules</td></tr>}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{edit ? 'Edit Module' : 'Add Module'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancel</Button>
          <Button onClick={save}>{edit ? 'Update' : 'Create'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

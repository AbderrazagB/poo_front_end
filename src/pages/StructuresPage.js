import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';

const initialForm = {
  label: '',
};

const StructuresPage = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchStructures = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/structures/v1/manager');
      setStructures(res.data);
    } catch (err) {
      setError('Failed to fetch structures');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this structure?')) return;
    try {
      await api.delete(`/structures/v1/admin/delete/${id}`);
      setStructures(structures.filter(s => s.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { label: form.label };
      await api.post('/structures/v1/admin/create', payload);
      setShowModal(false);
      fetchStructures();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2>Structures</h2>
      <Button className="mb-3" onClick={handleShowCreate}>Add Structure</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {structures.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.label}</td>
                <td>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Structure</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Label</Form.Label>
              <Form.Control name="label" value={form.label} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default StructuresPage;

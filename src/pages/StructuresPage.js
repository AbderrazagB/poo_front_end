import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import { useSelector } from 'react-redux';

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
  const { role } = useSelector(state => state.auth);

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
    <div className="table-section">
      <div className="shadow-lg border-0 table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Structures</h2>
          <Button className="add-btn" onClick={handleShowCreate} disabled={role === 'MANAGER'}>
            Add Structure
          </Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? <Spinner animation="border" /> : (
          <div className="table-responsive">
            <Table className="elegant-table align-middle">
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
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(s.id)}
                        disabled={role === 'MANAGER'}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
              <Button variant="secondary" onClick={() => setShowModal(false)} disabled={role === 'MANAGER'}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={saving || role === 'MANAGER'}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default StructuresPage;

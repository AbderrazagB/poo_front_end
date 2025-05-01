import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';

const initialForm = {
  id: null,
  label: '',
};

const DomainsPage = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchDomains = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/domains/v1/manager');
      setDomains(res.data);
    } catch (err) {
      setError('Failed to fetch domains');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleShowEdit = (d) => {
    setForm({ id: d.id, label: d.label });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) return;
    try {
      await api.delete(`/domains/v1/admin/delete/${id}`);
      setDomains(domains.filter(d => d.id !== id));
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
      await api.post('/domains/v1/admin/create', payload);
      setShowModal(false);
      fetchDomains();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2>Domains</h2>
      <Button className="mb-3" onClick={handleShowCreate}>Add Domain</Button>
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
            {domains.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.label}</td>
                <td>
                  <Button size="sm" variant="info" onClick={() => handleShowEdit(d)} className="me-2" disabled>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(d.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Domain</Modal.Title>
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
            <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DomainsPage; 
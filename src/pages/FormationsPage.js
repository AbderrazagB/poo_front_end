import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import { useSelector } from 'react-redux';

const initialForm = {
  id: null,
  title: '',
  domainId: '',
  durationInDays: '',
  budget: '',
  year: '',
};

const FormationsPage = () => {
  const [formations, setFormations] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { role } = useSelector(state => state.auth);

  const fetchFormations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/courses/v1/manager');
      setFormations(res.data);
    } catch (err) {
      setError('Failed to fetch formations');
    }
    setLoading(false);
  };

  const fetchDomains = async () => {
    try {
      const res = await api.get('/domains/v1/manager');
      setDomains(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchFormations();
    fetchDomains();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleShowEdit = (f) => {
    setForm({
      id: f.id,
      title: f.title,
      domainId: f.domain?.id || '',
      durationInDays: f.durationInDays || '',
      budget: f.budget || '',
      year: f.year || '',
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this formation?')) return;
    try {
      await api.delete(`/courses/v1/manager/delete/${id}`);
      setFormations(formations.filter(f => f.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['domainId', 'durationInDays', 'budget', 'year'].includes(name) ? Number(value) : value;
    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        domainId: form.domainId,
        durationInDays: form.durationInDays,
        budget: form.budget,
        year: form.year,
      };

      if (isEdit && form.id != null) {
        await api.post('/courses/v1/manager/create', { ...payload, id: form.id });
      } else {
        await api.post('/courses/v1/manager/create', payload);
      }

      setShowModal(false);
      fetchFormations();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  return (
    <div className="table-section">
      <div className="shadow-lg border-0 table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Formations</h2>
          <Button variant="primary" className="mb-3" onClick={handleShowCreate} disabled={role === 'MANAGER'}>
            Add Formation
          </Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? <Spinner animation="border" /> : (
          <div className="table-responsive">
            <Table className="elegant-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Domain</th>
                  <th>Duration (days)</th>
                  <th>Budget</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formations.map(f => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.title}</td>
                    <td>{f.domain?.label}</td>
                    <td>{f.durationInDays}</td>
                    <td>{f.budget}</td>
                    <td>{f.year}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleShowEdit(f)}
                        className="me-2"
                        disabled={role === 'MANAGER'}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(f.id)}
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
            <Modal.Title>{isEdit ? 'Edit' : 'Add'} Formation</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" value={form.title} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Domain</Form.Label>
                <Form.Select name="domainId" value={form.domainId} onChange={handleChange} required>
                  <option value="">Select Domain</option>
                  {domains.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration (days)</Form.Label>
                <Form.Control name="durationInDays" type="number" value={form.durationInDays} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Budget</Form.Label>
                <Form.Control name="budget" type="number" value={form.budget} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Control name="year" type="number" value={form.year} onChange={handleChange} required />
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

export default FormationsPage;

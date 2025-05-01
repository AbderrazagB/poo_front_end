import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';

const initialForm = {
  id: null,
  name: '',
};

const EmployersPage = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchEmployers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/employers/v1/manager');
      setEmployers(res.data);
    } catch (err) {
      setError('Failed to fetch employers');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleShowEdit = (e) => {
    setForm({ id: e.id, name: e.name });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employer?')) return;
    try {
      await api.delete(`/employers/v1/manager/delete/${id}`);
      setEmployers(employers.filter(e => e.id !== id));
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
      const payload = { name: form.name };
      if (isEdit) {
        await api.post('/employers/v1/manager/update', { ...payload, id: form.id });
      } else {
        await api.post('/employers/v1/manager/create', payload);
      }
      setShowModal(false);
      fetchEmployers();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2>Employers</h2>
      <Button className="mb-3" onClick={handleShowCreate}>Add Employer</Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employers.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.name}</td>
                <td>
                  <Button size="sm" variant="info" onClick={() => handleShowEdit(e)} className="me-2">Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(e.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Employer</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
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

export default EmployersPage; 
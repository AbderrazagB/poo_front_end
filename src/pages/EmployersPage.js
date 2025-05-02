import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import { useSelector } from 'react-redux';

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
  const { role } = useSelector(state => state.auth);

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
    <div className="table-section">
      <div className="shadow-lg border-0 table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Employers</h2>
          <Button variant="primary" className="mb-3" onClick={handleShowCreate} disabled={role === 'MANAGER'}>
            Add Employer
          </Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? <Spinner animation="border" /> : (
          <div className="table-responsive">
            <Table className="elegant-table align-middle">
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
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleShowEdit(e)}
                        className="me-2"
                        disabled={role === 'MANAGER'}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(e.id)}
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

export default EmployersPage; 
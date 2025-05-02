import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import { useSelector } from 'react-redux';

const initialForm = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  type: '',
  employerId: '',
};

const FormateursPage = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formError, setFormError] = useState('');
  const { role } = useSelector(state => state.auth);

  const fetchFormateurs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/instructors/v1/manager');
      setFormateurs(res.data);
    } catch (err) {
      setError('Failed to fetch formateurs');
    }
    setLoading(false);
  };

  const fetchEmployers = async () => {
    try {
      const res = await api.get('/employers/v1/manager');
      setEmployers(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchFormateurs();
    fetchEmployers();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setIsEdit(false);
    setFormError('');
    setShowModal(true);
  };

  const handleShowEdit = (f) => {
    setForm({
      id: f.id,
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      phone: f.phone,
      type: f.type || '',
      employerId: f.employer?.id || '',
    });
    setFormError('');
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this formateur?')) return;
    try {
      await api.delete(`/instructors/v1/manager/delete/${id}`);
      setFormateurs(formateurs.filter(f => f.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'employerId' ? Number(value) : value;
    setForm({ ...form, [name]: parsedValue });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s()-]+$/;

    if (!emailRegex.test(form.email)) {
      setFormError('Invalid email format.');
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      setFormError('Phone number can only contain digits, spaces, +, -, or parentheses.');
      return false;
    }

    if (!form.type || !form.employerId) {
      setFormError('All fields are required.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        type: form.type,
        employerId: Number(form.employerId),
      };

      if (isEdit) {
        await api.post('/instructors/v1/manager/update', { ...payload, id: form.id });
      } else {
        await api.post('/instructors/v1/manager/create', payload);
      }

      setShowModal(false);
      fetchFormateurs();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  return (
    <div className="table-section">
      <div className="shadow-lg border-0 table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Formateurs</h2>
          <Button variant="primary" className="mb-3" onClick={handleShowCreate} disabled={role === 'MANAGER'}>
            Add Formateur
          </Button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? <Spinner animation="border" /> : (
          <div className="table-responsive">
            <Table className="elegant-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Employer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formateurs.map(f => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.firstName}</td>
                    <td>{f.lastName}</td>
                    <td>{f.email}</td>
                    <td>{f.phone}</td>
                    <td>{f.type}</td>
                    <td>{f.employer?.name}</td>
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
            <Modal.Title>{isEdit ? 'Edit' : 'Add'} Formateur</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {formError && <Alert variant="danger">{formError}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control name="firstName" value={form.firstName} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="lastName" value={form.lastName} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" value={form.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={form.phone} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="EXTERNAL">EXTERNAL</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Employer</Form.Label>
                <Form.Select name="employerId" value={form.employerId} onChange={handleChange} required>
                  <option value="">Select Employer</option>
                  {employers.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </Form.Select>
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

export default FormateursPage;

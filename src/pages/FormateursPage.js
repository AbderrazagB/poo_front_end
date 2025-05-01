import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';

const initialForm = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  type: '',
  employerId: '', // Ensure this is empty initially
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
    } catch (err) {
      console.error('Failed to fetch employers');
    }
  };

  useEffect(() => {
    fetchFormateurs();
    fetchEmployers();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setIsEdit(false);
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
      employerId: f.employer?.id || '', // Ensure this is correctly set
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this formateur?')) return;
    try {
      await api.delete(`/instructors/v1/manager/delete/${id}`);
      setFormateurs(formateurs.filter((f) => f.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert employerId to number if it's selected
    if (name === 'employerId') {
      setForm({ ...form, [name]: value ? Number(value) : '' }); // Ensure it's a number or empty string
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Logging form data for debugging
    console.log('Form Data:', form);

    try {
      // Check if employerId is selected
      if (!form.employerId) {
        alert('Please select an employer');
        setSaving(false);
        return;
      }

      if (isEdit) {
        // Update instructor
        await api.post('/instructors/v1/manager/update', form);
      } else {
        // Create new instructor
        await api.post('/instructors/v1/manager/create', form);
      }
      setShowModal(false);
      fetchFormateurs();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2>Formateurs</h2>
      <Button className="mb-3" onClick={handleShowCreate}>
        Add Formateur
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
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
            {formateurs.map((f) => (
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
                    variant="info"
                    onClick={() => handleShowEdit(f)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(f.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit' : 'Add'} Formateur</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="EXTERNAL">EXTERNAL</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Employer</Form.Label>
              <Form.Select
                name="employerId"
                value={form.employerId}
                onChange={handleChange}
                required
              >
                <option value="">Select Employer</option>
                {employers.map((employer) => (
                  <option key={employer.id} value={employer.id}>
                    {employer.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default FormateursPage;

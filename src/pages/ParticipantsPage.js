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
  structureId: '',
  profileId: '',
  courseId: '',
};

const ParticipantsPage = () => {
  const [participants, setParticipants] = useState([]);
  const [structures, setStructures] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formError, setFormError] = useState('');
  const { role } = useSelector(state => state.auth);

  const fetchParticipants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/participants/v1/manager');
      setParticipants(res.data);
    } catch (err) {
      setError('Failed to fetch participants');
    }
    setLoading(false);
  };

  const fetchStructures = async () => {
    try {
      const res = await api.get('/structures/v1/manager');
      setStructures(res.data);
    } catch {}
  };

  const fetchProfiles = async () => {
    try {
      const res = await api.get('/profiles/v1/manager');
      setProfiles(res.data);
    } catch {}
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/v1/manager');
      setCourses(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchParticipants();
    fetchStructures();
    fetchProfiles();
    fetchCourses();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setIsEdit(false);
    setFormError('');
    setShowModal(true);
  };

  const handleShowEdit = (p) => {
    setForm({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      structureId: p.structure?.id || '',
      profileId: p.profile?.id || '',
      courseId: p.course?.id || '',
    });
    setFormError('');
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this participant?')) return;
    try {
      await api.delete(`/participants/v1/manager/delete/${id}`);
      setParticipants(participants.filter(p => p.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['structureId', 'profileId', 'courseId'].includes(name) ? Number(value) : value;
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
        structureId: Number(form.structureId),
        profileId: Number(form.profileId),
        courseId: Number(form.courseId),
      };

      if (isEdit) {
        await api.post('/participants/v1/manager/update', { ...payload, id: form.id });
      } else {
        await api.post('/participants/v1/manager/create', payload);
      }

      setShowModal(false);
      fetchParticipants();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  return (
    <div className="table-section">
      <div className="shadow-lg border-0 table-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Participants</h2>
          <Button variant="primary" className="mb-3" onClick={handleShowCreate} disabled={role === 'MANAGER'}>
            Add Participant
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
                  <th>Structure</th>
                  <th>Profile</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.firstName}</td>
                    <td>{p.lastName}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.structure?.label}</td>
                    <td>{p.profile?.label}</td>
                    <td>{p.course?.title}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleShowEdit(p)}
                        className="me-2"
                        disabled={role === 'MANAGER'}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(p.id)}
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
            <Modal.Title>{isEdit ? 'Edit' : 'Add'} Participant</Modal.Title>
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
                <Form.Label>Structure</Form.Label>
                <Form.Select name="structureId" value={form.structureId} onChange={handleChange} required>
                  <option value="">Select Structure</option>
                  {structures.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Profile</Form.Label>
                <Form.Select name="profileId" value={form.profileId} onChange={handleChange} required>
                  <option value="">Select Profile</option>
                  {profiles.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Course</Form.Label>
                <Form.Select name="courseId" value={form.courseId} onChange={handleChange} required>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
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

export default ParticipantsPage;

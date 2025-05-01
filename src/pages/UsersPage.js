import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner, Card, Row, Col, InputGroup } from 'react-bootstrap';
import api from '../api';
import { FaUserPlus, FaTrash, FaSearch, FaUser } from 'react-icons/fa';

const initialForm = {
  login: '',
  password: '',
  roleName: '',
};

// Color map for different roles
const roleColors = {
  ADMIN: 'bg-danger',
  USER: 'bg-primary',
  MODERATOR: 'bg-warning',
  GUEST: 'bg-secondary',
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch all users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users/v1/admin');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles/v1/manager');
      setRoles(res.data);
    } catch {
      setError('Failed to fetch roles');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleShowCreate = () => {
    setForm(initialForm);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/v1/admin/delete/${id}`);
      setUsers(users.filter(u => u.id !== id)); // Filter out the deleted user
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
      // Use sign-up endpoint for adding user
      const payload = {
        login: form.login,
        password: form.password,
        roleName: form.roleName,
      };
      await api.post('/auth/v1/sign-up', payload);
      setShowModal(false);
      fetchUsers();
    } catch {
      alert('Save failed');
    }
    setSaving(false);
  };

  const filteredUsers = users.filter(u => u.login.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="shadow-lg border-0">
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col><h2 className="mb-0"><FaUser className="me-2 text-primary" />Users</h2></Col>
          <Col xs="auto">
            <Button variant="success" onClick={handleShowCreate} className="d-flex align-items-center gap-2">
              <FaUserPlus /> Add User
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6} lg={4}>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Search by login..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? <Spinner animation="border" /> : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Login</th>
                  <th>Role</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={3} className="text-center text-muted">No users found.</td></tr>
                ) : filteredUsers.map(u => (
                  <tr key={u.id} className="user-row">
                    <td>{u.login}</td>
                    <td>
                      {/* Role badge with color */}
                      <span className={`badge ${roleColors[u.role.name] || 'bg-info'} text-dark`}>
                        {u.role.name}
                      </span>
                    </td>
                    <td>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u.id)} title="Delete">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Login</Form.Label>
                <Form.Control name="login" value={form.login} onChange={handleChange} required autoFocus />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" value={form.password} onChange={handleChange} type="password" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="roleName" value={form.roleName} onChange={handleChange} required>
                  <option value="">Select role</option>
                  {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default UsersPage;

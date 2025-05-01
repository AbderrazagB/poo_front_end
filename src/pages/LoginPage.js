import React, { useState } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login || !password) {
      dispatch(loginFailure('Login and password are required'));
      return;
    }
    dispatch(loginStart());
    try {
      const response = await api.post('/auth/v1/sign-in', { login, password });
      const { accessToken, login: user, roleName: role } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', user);
      localStorage.setItem('role', role);
      dispatch(loginSuccess({ user, token: accessToken, role }));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.error || 'Login failed'));
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 400, marginTop: 80 }}>
      <Card.Body>
        <h3 className="mb-4">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="login">
            <Form.Label>Login</Form.Label>
            <Form.Control
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="Enter login"
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginPage; 
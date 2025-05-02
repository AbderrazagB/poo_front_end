import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store';
import { motion } from 'framer-motion';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: 'calc(100vh - 150px)' }}
    >
      <Card className="shadow-lg border-0" style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-center mb-4 fw-bold">Welcome Back</h3>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="danger">{error}</Alert>
              </motion.div>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="login">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                  className="py-2"
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="py-2"
                />
              </Form.Group>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Sign In'}
                </Button>
              </motion.div>
            </Form>
          </motion.div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default LoginPage; 
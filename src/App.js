import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import FormateursPage from './pages/FormateursPage';
import ParticipantsPage from './pages/ParticipantsPage';
import FormationsPage from './pages/FormationsPage';
import EmployersPage from './pages/EmployersPage';
import StructuresPage from './pages/StructuresPage';
import ProfilesPage from './pages/ProfilesPage';
import DomainsPage from './pages/DomainsPage';
import StatisticsPage from './pages/StatisticsPage';
import { useSelector, useDispatch } from 'react-redux';
import { logout, loginSuccess } from './store';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { initializeAuthFromStorage } from './store';
import { FaChalkboardTeacher, FaUsers, FaChartBar, FaUserTie, FaBuilding, FaUserGraduate, FaBook, FaLayerGroup, FaThList } from 'react-icons/fa';

function PrivateRoute({ children }) {
  const { token } = useSelector(state => state.auth);
  return token ? children : <Navigate to="/login" />;
}

function RequireRole({ allowedRoles, children }) {
  const { role } = useSelector(state => state.auth);
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
}

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, role, user } = useSelector(state => state.auth);

  useEffect(() => {
    initializeAuthFromStorage(dispatch, loginSuccess);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <FaChalkboardTeacher size={28} />
            <span style={{ fontWeight: 700, fontSize: 22 }}>Excellent Training</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto">
              {token && <Nav.Link as={Link} to="/dashboard"><FaThList className="me-1" />Dashboard</Nav.Link>}
              {role === 'ADMIN' && <Nav.Link as={Link} to="/users"><FaUsers className="me-1" />Users</Nav.Link>}
              {(role === 'ADMIN' || role === 'MANAGER') && (
                <NavDropdown title={<span><FaBook className="me-1" />Management</span>} id="management-dropdown">
                  <NavDropdown.Item as={Link} to="/formateurs"><FaUserTie className="me-1" />Formateurs</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/participants"><FaUserGraduate className="me-1" />Participants</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/formations"><FaLayerGroup className="me-1" />Formations</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/employers"><FaBuilding className="me-1" />Employers</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/structures"><FaBuilding className="me-1" />Structures</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profiles"><FaUsers className="me-1" />Profiles</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/domains"><FaBook className="me-1" />Domains</NavDropdown.Item>
                </NavDropdown>
              )}
              {(role === 'ADMIN' || role === 'MANAGER') && <Nav.Link as={Link} to="/statistics"><FaChartBar className="me-1" />Statistics</Nav.Link>}
            </Nav>
            {token && (
              <div className="d-flex align-items-center gap-2">
                <span className="text-white fw-bold">{user}</span>
                <Button variant="outline-light" onClick={handleLogout} size="sm">Logout</Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN']}><UsersPage /></RequireRole></PrivateRoute>} />
          <Route path="/formateurs" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><FormateursPage /></RequireRole></PrivateRoute>} />
          <Route path="/participants" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><ParticipantsPage /></RequireRole></PrivateRoute>} />
          <Route path="/formations" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><FormationsPage /></RequireRole></PrivateRoute>} />
          <Route path="/employers" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><EmployersPage /></RequireRole></PrivateRoute>} />
          <Route path="/structures" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><StructuresPage /></RequireRole></PrivateRoute>} />
          <Route path="/profiles" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><ProfilesPage /></RequireRole></PrivateRoute>} />
          <Route path="/domains" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><DomainsPage /></RequireRole></PrivateRoute>} />
          <Route path="/statistics" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN','MANAGER']}><StatisticsPage /></RequireRole></PrivateRoute>} />
          <Route path="/unauthorized" element={<div><h2>Unauthorized</h2><p>You do not have access to this page.</p></div>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaChartBar,
  FaUserGraduate,
  FaThList,
  FaBriefcase,
  FaSitemap,
  FaChalkboard,
  FaTags,
  FaIdBadge,
  FaCogs
} from 'react-icons/fa';

import { logout, loginSuccess } from './store';
import { initializeAuthFromStorage } from './store';

// Pages
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
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
import LoadingSpinner from './components/LoadingSpinner';

// Styles
import './styles/theme.css';

function PrivateRoute({ children }) {
  const { token } = useSelector(state => state.auth);
  return token ? children : <Navigate to="/login" />;
}

function RequireRole({ allowedRoles, children }) {
  const { role } = useSelector(state => state.auth);
  const isReadOnly = role === 'MANAGER';

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return isReadOnly ? React.cloneElement(children, { readOnly: true }) : children;
}

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role } = useSelector(state => state.auth);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await initializeAuthFromStorage(dispatch, loginSuccess);
      setLoading(false);
    };
    initAuth();
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="app-root">
      <div className="animated-bg">
        <div className="bg-anim-circle circle1" />
        <div className="bg-anim-circle circle2" />
        <div className="bg-anim-circle circle3" />
        <div className="bg-anim-circle circle4" />
        <div className="bg-anim-circle circle5" />
        <div className="bg-anim-circle circle6" />
        <div className="bg-anim-circle circle7" />
        <div className="bg-anim-circle circle8" />
      </div>

      <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <FaChalkboardTeacher size={28} />
            <span style={{ fontWeight: 700, fontSize: 22 }}>TaskFlow</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto">
              {token && <Nav.Link as={Link} to="/dashboard"><FaThList className="me-1" />Dashboard</Nav.Link>}
              {role === 'ADMIN' && <Nav.Link as={Link} to="/users"><FaUsers className="me-1" />Users</Nav.Link>}
              {(role === 'ADMIN' || role === 'MANAGER') && (
                <NavDropdown title={<span><FaCogs className="me-1" />Management</span>} id="management-dropdown">
                  <NavDropdown.Item as={Link} to="/formateurs">
                    <FaChalkboardTeacher className="me-1" />Instructors
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/participants">
                    <FaUserGraduate className="me-1" />Participants
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/employers">
                    <FaBriefcase className="me-1" />Employers
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/structures">
                    <FaSitemap className="me-1" />Organizations
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/formations">
                    <FaChalkboard className="me-1" />Trainings
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/domains">
                    <FaTags className="me-1" />Domains
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profiles">
                    <FaIdBadge className="me-1" />Profiles
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {(role === 'ADMIN' || role === 'MANAGER') && (
                <Nav.Link as={Link} to="/statistics">
                  <FaChartBar className="me-1" />Statistics
                </Nav.Link>
              )}
            </Nav>
            <div className="d-flex align-items-center gap-3">
              {!token ? (
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="sm"
                  className="ms-2 px-4 fw-bold login-btn"
                  style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(79,70,229,0.08)' }}
                >
                  Login
                </Button>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span className={`text-white fw-bold role-badge ${role?.toLowerCase()}`}>
                    {role?.toLowerCase()}
                  </span>
                  <Button variant="outline-light" onClick={handleLogout} size="sm" className="logout-btn">
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN']}><UsersPage /></RequireRole></PrivateRoute>} />
            <Route path="/formateurs" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><FormateursPage /></RequireRole></PrivateRoute>} />
            <Route path="/participants" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><ParticipantsPage /></RequireRole></PrivateRoute>} />
            <Route path="/formations" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><FormationsPage /></RequireRole></PrivateRoute>} />
            <Route path="/employers" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><EmployersPage /></RequireRole></PrivateRoute>} />
            <Route path="/structures" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><StructuresPage /></RequireRole></PrivateRoute>} />
            <Route path="/profiles" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><ProfilesPage /></RequireRole></PrivateRoute>} />
            <Route path="/domains" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><DomainsPage /></RequireRole></PrivateRoute>} />
            <Route path="/statistics" element={<PrivateRoute><RequireRole allowedRoles={['ADMIN', 'MANAGER']}><StatisticsPage /></RequireRole></PrivateRoute>} />
            <Route path="/unauthorized" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-5">
                <h2>Unauthorized</h2>
                <p>You do not have access to this page.</p>
              </motion.div>
            } />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;

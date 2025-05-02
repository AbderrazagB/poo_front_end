import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaChartLine, FaUsers, FaLightbulb, FaBook } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.auth);

  const handleGetStarted = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page hero-section d-flex align-items-center justify-content-center min-vh-100">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col lg={7} className="text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <h1 className="display-3 fw-bold mb-3 gradient-text">Organize. Collaborate. Succeed.</h1>
              <p className="lead mb-4 text-secondary fs-4">
                <span className="brand-highlight">TaskFlow</span> is your modern workspace for seamless team management, productivity, and growth.<br/>
                Empower your workflow with intuitive tools, real-time updates, and smart analytics—all in one place.
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleGetStarted}
                className="get-started-btn shadow-lg px-5 py-3 mb-4"
                style={{ fontSize: '1.25rem', borderRadius: 12 }}
              >
                {token ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <div className="d-flex flex-wrap justify-content-center gap-4 mt-4 landing-badges">
                <div className="badge-card">
                  <FaChartLine size={32} className="text-primary mb-2" />
                  <div className="fw-bold">Visual Progress</div>
                  <small className="text-secondary">See your team's goals in real time</small>
                </div>
                <div className="badge-card">
                  <FaUsers size={32} className="text-primary mb-2" />
                  <div className="fw-bold">Collaboration</div>
                  <small className="text-secondary">Chat, assign, and share instantly</small>
                </div>
                <div className="badge-card">
                  <FaLightbulb size={32} className="text-primary mb-2" />
                  <div className="fw-bold">Smart Insights</div>
                  <small className="text-secondary">Make better decisions, faster</small>
                </div>
                <div className="badge-card">
                  <FaBook size={32} className="text-primary mb-2" />
                  <div className="fw-bold">Knowledge Base</div>
                  <small className="text-secondary">Centralize docs & info</small>
                </div>
              </div>
              <div className="mt-5">
                <Row className="g-4 justify-content-center">
                  <Col md={4}>
                    <div className="feature-tile p-4 h-100">
                      <h5 className="fw-bold mb-2">All-in-One Dashboard</h5>
                      <p className="text-secondary mb-0">Manage users, teams, and projects from a single, intuitive interface. Everything you need, always at your fingertips.</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="feature-tile p-4 h-100">
                      <h5 className="fw-bold mb-2">Lightning Fast & Secure</h5>
                      <p className="text-secondary mb-0">Enjoy a blazing-fast experience with enterprise-grade security. Your data is always safe and accessible.</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="feature-tile p-4 h-100">
                      <h5 className="fw-bold mb-2">Mobile Ready</h5>
                      <p className="text-secondary mb-0">Stay productive on the go. TaskFlow is fully responsive and works beautifully on all your devices.</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
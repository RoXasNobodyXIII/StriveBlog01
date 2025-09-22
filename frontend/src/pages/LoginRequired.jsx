import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

function LoginRequired() {
  const [activeTab, setActiveTab] = useState('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/add-post');
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    navigate('/add-post');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 0'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card style={{
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '40px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
                <h1 style={{ margin: 0, fontWeight: 'bold', fontSize: '2rem' }}>
                  Access Required
                </h1>
                <p style={{ margin: '15px 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
                  In order to create a post, you must login or register first
                </p>
              </div>

              <Card.Body style={{ padding: '40px' }}>
                <Alert variant="info" style={{ borderRadius: '10px', textAlign: 'center' }}>
                  <strong>📝 Want to share your thoughts?</strong><br />
                  Join our community by creating an account or signing in to start posting!
                </Alert>

                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                  style={{ borderBottom: '2px solid #e9ecef' }}
                >
                  <Tab eventKey="login" title="🔑 Login">
                    <div style={{ padding: '20px 0' }}>
                      <Login onSuccess={handleAuthSuccess} />
                    </div>
                  </Tab>
                  <Tab eventKey="register" title="📝 Register">
                    <div style={{ padding: '20px 0' }}>
                      <Register onSuccess={handleAuthSuccess} />
                    </div>
                  </Tab>
                </Tabs>

                <div style={{
                  textAlign: 'center',
                  marginTop: '30px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e9ecef'
                }}>
                  <p style={{ color: '#6c757d', margin: 0 }}>
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#667eea',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginRequired;

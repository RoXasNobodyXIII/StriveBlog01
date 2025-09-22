import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function Login({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/authors/${result.user._id}`);
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div>
      {error && (
        <Alert variant="danger" style={{ borderRadius: '10px', marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
            Email
          </Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              borderRadius: '10px',
              border: '2px solid #e9ecef',
              padding: '12px 16px'
            }}
            placeholder="Inserisci la tua email"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: '600', color: '#2c3e50' }}>
            Password
          </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              borderRadius: '10px',
              border: '2px solid #e9ecef',
              padding: '12px 16px'
            }}
            placeholder="Inserisci la tua password"
          />
        </Form.Group>

        <Button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Accesso in corso...
            </>
          ) : (
            'Accedi'
          )}
        </Button>
      </Form>

      {/* Google Login Button */}
      <div style={{ marginTop: '20px' }}>
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          style={{
            width: '100%',
            border: '2px solid #dadce0',
            borderRadius: '10px',
            padding: '12px',
            fontWeight: '600',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: '#3c4043',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.964v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.964A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.964 4.042l3-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .964 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Accedi con Google
        </Button>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #e9ecef'
      }}>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Non hai un account?{' '}
          <Link
            to="/register"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

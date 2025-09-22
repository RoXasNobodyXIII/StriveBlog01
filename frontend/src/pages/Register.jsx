import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function Register({ onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    avatar: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password length
    if (formData.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      setLoading(false);
      return;
    }

    const result = await register(formData);

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

  return (
    <div>
      {error && (
        <Alert variant="danger" className="alert-custom">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">
                Nome
              </Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="form-control-custom"
                placeholder="Inserisci il nome"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label-custom">
                Cognome
              </Form.Label>
              <Form.Control
                type="text"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                required
                className="form-control-custom"
                placeholder="Inserisci il cognome"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="form-label-custom">
            Email
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control-custom"
            placeholder="Inserisci l'email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="form-label-custom">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="form-control-custom"
            placeholder="Inserisci la password (min 6 caratteri)"
          />
        </Form.Group>



        <Form.Group className="mb-4">
          <Form.Label className="form-label-custom">
            Avatar URL (opzionale)
          </Form.Label>
          <Form.Control
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="form-control-custom"
            placeholder="https://example.com/avatar.jpg"
          />
        </Form.Group>

        <Button
          type="submit"
          disabled={loading}
          className="btn-primary-custom"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Loggin in...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </Form>

      <div className="text-center-custom">
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            className="link-custom"
          >
           Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

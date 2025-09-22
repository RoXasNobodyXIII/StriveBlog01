import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import axios from '../../data/axios.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function AddPost() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    cover: '',
    readTimeValue: 5,
    readTimeUnit: 'minutes',
    author: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axios.post('/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setFormData(prev => ({
        ...prev,
        cover: response.data.url
      }));
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    setLoading(true);

    const postData = {
      title: formData.title,
      category: formData.category,
      cover: formData.cover,
      readTime: {
        value: parseInt(formData.readTimeValue),
        unit: formData.readTimeUnit
      },
      author: user?.email || '',
      content: formData.content
    };

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('/blogPosts', postData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Post Uploaded!');
      // Reset form or redirect
      setFormData({
        title: '',
        category: '',
        cover: '',
        readTimeValue: 5,
        readTimeUnit: 'minutes',
        author: '',
        content: ''
      });
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.');

      } else {
        alert('Error Uploading Post: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tecnologia', 'Sport', 'Cucina', 'Viaggi', 'Salute', 'Intrattenimento'];

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Crea un nuovo post</h1>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Prova"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Insert Local Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />}
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Read Time</Form.Label>
              <Form.Select
                name="readTimeValue"
                value={formData.readTimeValue}
                onChange={handleChange}
              >
                {Array.from({ length: 60 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Unità</Form.Label>
              <Form.Select
                name="readTimeUnit"
                value={formData.readTimeUnit}
                onChange={handleChange}
              >
                <option value="minuti">minutes</option>
                <option value="ore">hours</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            readOnly
            value={user ? `${user.nome} ${user.cognome}` : ''}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Text Post"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </Form>
    </Container>
  );
}

export default AddPost;

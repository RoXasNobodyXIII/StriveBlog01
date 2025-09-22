import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function PostPreview({ post }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-4 shadow-sm border-0" style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderRadius: '15px',
      overflow: 'hidden'
    }}>
      <Card.Body style={{ padding: '20px' }}>
        <Row>
          {post.cover && (
            <Col md={4} className="d-flex align-items-center">
              <div style={{
                width: '100%',
                height: '150px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <Card.Img
                  src={post.cover}
                  alt={post.title}
                  style={{
                    height: '100%',
                    objectFit: 'cover',
                    width: '100%'
                  }}
                />
              </div>
            </Col>
          )}
          <Col md={post.cover ? 8 : 12}>
            <div style={{ padding: post.cover ? '0 0 0 20px' : '0' }}>
              <Card.Title style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '10px'
              }}>
                {post.title}
              </Card.Title>
              <Card.Text style={{
                background: '#6c757d',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                display: 'inline-block',
                fontSize: '0.85rem',
                marginBottom: '15px'
              }}>
                📂 {post.category}
              </Card.Text>
              <Card.Text
                style={{
                  color: '#007bff',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  padding: '6px 10px',
                  borderRadius: '15px',
                  background: 'rgba(0,123,255,0.1)',
                  marginBottom: '15px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  if (post.author && typeof post.author === 'object' && post.author._id) {
                    navigate(`/authors/${post.author._id}`);
                  } else if (typeof post.author === 'string') {
                    // For email authors, try to find author by email
                    navigate(`/authors?email=${encodeURIComponent(post.author)}`);
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0,123,255,0.2)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0,123,255,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ marginRight: '8px' }}>👤</span>
                <strong>Author:</strong> {
                  post.author && typeof post.author === 'object' && post.author.nome
                    ? `${post.author.nome} ${post.author.cognome}`
                    : typeof post.author === 'string'
                      ? post.author
                      : 'Author not specified'
                }
              </Card.Text>
              <Card.Text style={{
                color: '#495057',
                lineHeight: '1.6',
                marginBottom: '20px',
                fontSize: '1.1rem'
              }}>
                {post.content
                  ? post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content
                  : 'No content available.'}
              </Card.Text>
              <Button
                variant="primary"
                href={`/posts/${post._id}`}
                style={{
                  background: 'linear-gradient(45deg, #007bff, #0056b3)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '8px 20px',
                  fontWeight: '500',
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(0,123,255,0.3)'
                }}
              >
                Read More →
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default PostPreview;

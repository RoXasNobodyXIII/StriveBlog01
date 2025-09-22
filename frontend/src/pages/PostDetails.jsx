import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../data/axios';
import { Spinner, Alert, Container } from 'react-bootstrap';

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get('/blogPosts/' + id);
        setPost(res.data);
      } catch (err) {
        setError('Failed to load post details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #007bff',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>Loading post...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>Error</h3>
          <p style={{ color: '#6c757d' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ color: '#ffc107', marginBottom: '15px' }}>Post Not Found</h3>
          <p style={{ color: '#6c757d' }}>The post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 0'
    }}>
      <Container>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
          marginBottom: '50px'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '30px',
              lineHeight: '1.2'
            }}>
              {post.title}
            </h1>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <span style={{
                background: 'linear-gradient(45deg, #28a745, #20c997)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(40,167,69,0.3)'
              }}>
                📂 {post.category}
              </span>
              <span style={{
                color: '#6c757d',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>⏱️</span>
                {post.readTime.value} {post.readTime.unit}
              </span>
              <span
                style={{
                  color: '#007bff',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  background: 'rgba(0,123,255,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  if (post.author && typeof post.author === 'object' && post.author._id) {
                    navigate(`/authors/${post.author._id}`);
                  } else if (typeof post.author === 'string') {
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
              </span>
            </div>

            {post.cover && (
              <div style={{
                textAlign: 'center',
                marginBottom: '40px'
              }}>
                <div style={{
                  display: 'inline-block',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  maxWidth: '100%'
                }}>
                  <img
                    src={post.cover}
                    alt={post.title}
                    style={{
                      maxHeight: '400px',
                      width: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{
              borderTop: '2px solid #e9ecef',
              paddingTop: '30px',
              marginTop: '30px'
            }}></div>

            <div
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#495057',
                marginTop: '30px'
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PostDetails;

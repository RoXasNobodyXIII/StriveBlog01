import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../data/axios';
import { Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import PostPreview from '../components/PostPreview';

function AuthorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if this is the current user's profile
  const isOwnProfile = currentUser && currentUser._id === id;



  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get('/authors/' + id);
        setAuthor(res.data);
      } catch (err) {
        setError('Failed to load author profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  useEffect(() => {
    if (author) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/authors/${author._id}/blogPosts`);
          setPosts(res.data || []);
        } catch (err) {
          // Failed to load posts
        }
      };
      fetchPosts();
    }
  }, [author]);

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
          <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>Loading author profile...</p>
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

  if (!author) {
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
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👤</div>
          <h3 style={{ color: '#ffc107', marginBottom: '15px' }}>Author Not Found</h3>
          <p style={{ color: '#6c757d' }}>The author you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 0'
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            👤 Author Profile
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.1rem',
            fontWeight: '300'
          }}>
            Discover more about this author
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '50px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 20px',
              border: '4px solid #007bff',
              boxShadow: '0 6px 15px rgba(0,123,255,0.2)'
            }}>
              <img
                src={author.avatar || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"}
                alt="Author avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '1.8rem',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              {author.nome} {author.cognome}
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              marginTop: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#28a745',
                  marginBottom: '5px'
                }}>✉️</div>
                <p style={{ color: '#6c757d', margin: '0', fontSize: '0.9rem' }}>
                  <strong>Email:</strong><br />
                  {author.email}
                </p>
              </div>

            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '2rem',
              fontWeight: '600',
              margin: '0'
            }}>
              📝 {isOwnProfile ? 'Your Posts' : `Posts by ${author.nome} ${author.cognome}`}
            </h2>
            {isOwnProfile && (
              <Button
                onClick={() => navigate('/add-post')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 30px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                }}
              >
                ➕ Add New Post
              </Button>
            )}
          </div>
          <section>
            {posts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px',
                color: '#6c757d'
              }}>
                <h3 style={{ marginBottom: '20px' }}>
                  📭 {isOwnProfile ? 'No Posts Yet' : 'No Posts Found'}
                </h3>
                <p>
                  {isOwnProfile
                    ? "You haven't published any posts yet. Create your first post to get started!"
                    : "This author hasn't published any posts yet."
                  }
                </p>
                {isOwnProfile && (
                  <Button
                    onClick={() => navigate('/add-post')}
                    variant="outline-primary"
                    style={{
                      marginTop: '20px',
                      borderRadius: '25px',
                      padding: '10px 25px'
                    }}
                  >
                    Create Your First Post
                  </Button>
                )}
              </div>
            ) : (
              <Row>
                {posts.map(post => (
                  <Col sm={12} key={post._id}>
                    <PostPreview post={post} />
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AuthorProfile;

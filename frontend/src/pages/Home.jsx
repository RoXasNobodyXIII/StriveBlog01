import { Alert, Button, Col, InputGroup, Row, Form } from "react-bootstrap";
import UserPreview from "../components/UserPreview.jsx";
import { useEffect, useState } from "react";
import axios from "../../data/axios";
import PostPreview from "../components/PostPreview.jsx";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function Home() {
  const { user, token } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  const fetchAuthors = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const search = params.get('search') || '';
      const res = await axios.get('/authors', {
        params: search ? { nome: search, cognome: search } : {}
      });
      if (Array.isArray(res.data.authors)) {
        setAuthors(res.data.authors);
      } else if (Array.isArray(res.data.data)) {
        setAuthors(res.data.data);
      } else if (Array.isArray(res.data)) {
        setAuthors(res.data);
      } else {
        setAuthors([]);
      }
    } catch (e) {
    }
  };

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const search = params.get('search') || '';
      const res = await axios.get('/blogPosts', {
        params: search ? { title: search, category: search } : {}
      });
      if (Array.isArray(res.data.data)) {
        setPosts(res.data.data);
      } else if (Array.isArray(res.data.blogPosts)) {
        setPosts(res.data.blogPosts);
      } else {
        setPosts([]);
      }
    } catch (e) {
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchPosts();
  }, [location.search]);

  const deletePost = async (postId) => {
    if (!token) {
      alert('You must be logged in to delete posts.');
      return;
    }
    try {
      await axios.delete(`/blogPosts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Post deleted successfully.');
      fetchPosts();
    } catch (error) {
      alert('Failed to delete post.');
    }
  };

  const params = new URLSearchParams(location.search);
  const search = params.get('search') || '';

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
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            📚 Welcome to StriveBlog
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.2rem',
            fontWeight: '300'
          }}>
            A blog for everyone. Share your voice, explore others
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '50px'
        }}>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            📝 Latest Posts
          </h2>
          <section>
            {posts && posts.length > 0 ? (
              <Row>
                {posts.map(post => (
                  <Col sm={12} key={post._id}>
                    <PostPreview post={post} deletePost={deletePost} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '50px',
                color: '#6c757d'
              }}>
                <h3 style={{ marginBottom: '20px' }}>📭 No Content Available</h3>
                <p>Check back later for new posts!</p>
              </div>
            )}
          </section>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            👥 Our Authors
          </h2>
          <section>
            {authors && authors.length > 0 ? (
              <>
                <Row className="mt-4">
                  {authors.map(author => (
                    <Col sm={6} md={4} lg={3} key={author._id}>
                      <UserPreview profile={author} />
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '50px',
                color: '#6c757d'
              }}>
                <h3 style={{ marginBottom: '20px' }}>👤 No Authors Available</h3>
                <p>Authors will appear here once they join our platform!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;

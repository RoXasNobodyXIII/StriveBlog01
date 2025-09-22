import React from 'react';
import { Nav, Navbar, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleAddPost = () => {
    if (user) {
      navigate('/add-post');
    } else {
      navigate('/login-required');
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#667eea' }}>
          📝 My Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/authors">Authors</Nav.Link>
            <Button
              variant="outline-primary"
              onClick={handleAddPost}
              style={{
                borderRadius: '20px',
                marginLeft: '10px',
                fontWeight: '600'
              }}
            >
              ➕ Add Post
            </Button>
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={`👤 ${user.nome} ${user.cognome}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-posts">My Posts</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Sign In</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

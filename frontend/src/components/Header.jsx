import {
  Container,
  Image,
  Nav,
  NavDropdown,
  Navbar,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loginWithGoogle } = useAuth();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div>
      <Navbar expand="lg" className="navbarStyle bg-light shadow-sm">
        <Container className="d-flex align-items-center">
          <Navbar.Brand
            to="/"
            as={Link}
            className="py-0 me-2 d-flex align-items-center text-decoration-none"
          >
            <i className="bi bi-journal-text text-primary fs-2 me-3"></i>
            <span className="fs-3 text-primary fw-bold">StriveBlog</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link to="/" as={Link} className="text-dark">
                Home
              </Nav.Link>
{isAuthenticated && (
  <Nav.Link to="/add-post" as={Link} className="text-dark">
    Add Post
  </Nav.Link>
)}
            </Nav>
            <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
              <FormControl
                type="search"
                placeholder="Cerca..."
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="outline-success" type="submit">Cerca</Button>
            </Form>
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <NavDropdown
                  title={
                    <Image
                      src={user?.avatar || "https://placehold.co/40x40"}
                      roundedCircle
                      className="dropdownAvatar border"
                    />
                  }
                  id="nav-avatar-dropdown"
                  align="end"
                >
                  <NavDropdown.Item to="/profile" as={Link}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    style={{
                      border: '2px solid #dadce0',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      backgroundColor: 'white',
                      color: '#3c4043',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginRight: '10px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 18 18">
                      <path fill="#4285F4" d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.964v2.332A8.997 8.997 0 0 0 9 18z"/>
                      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.964A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.964 4.042l3-2.332z"/>
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .964 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    Google
                  </Button>
                  <Nav.Link to="/login" as={Link} className="text-dark me-2">
                    Sign In
                  </Nav.Link>
                  <Nav.Link to="/register" as={Link} className="text-primary">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import AuthorProfile from "./pages/AuthorProfile";
import PostDetails from "./pages/PostDetails";
import PostDetailsWithComments from "./pages/PostDetailsWithComments";
import AddPost from "./pages/AddPost";
import AddAuthor from "./pages/AddAuthor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginRequired from "./pages/LoginRequired";
import GoogleOAuthCallback from "./components/GoogleOAuthCallback";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <div style={{ flex: 1, padding: '20px 0' }}>
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:id" element={<PostDetailsWithComments />} />
                <Route path="/add-post" element={<AddPost />} />
                <Route path="/posts/edit-post/:id" element={<AddPost />} />
                <Route path="/authors/:id" element={<AuthorProfile />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/authors/add-author" element={<AddAuthor />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login-required" element={<LoginRequired />} />
                <Route path="/oauth/callback" element={<GoogleOAuthCallback />} />
                <Route path="*" element={
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '50px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    margin: '50px auto',
                    maxWidth: '600px'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                    <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Page Not Found</h1>
                    <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
                      The page you're looking for doesn't exist.
                    </p>
                  </div>
                } />
              </Routes>
            </Container>
          </div>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

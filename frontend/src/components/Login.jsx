useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    // Store the token in localStorage or your state management system
    localStorage.setItem('token', token);
    // Redirect to protected route or home page
    navigate('/');
  }
}, []);
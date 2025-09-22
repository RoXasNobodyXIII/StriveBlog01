import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogleCallback } = useAuth();

  useEffect(() => {
    navigate('/', { replace: true });

    const handleCallback = async () => {
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          await loginWithGoogleCallback(token, user);
          console.log('User logged in successfully');
        } catch (error) {
          console.error('OAuth callback error:', error);
        }
      }
    };

    setTimeout(handleCallback, 100);
  }, [searchParams, loginWithGoogleCallback, navigate]);

  return null;
};

export default GoogleOAuthCallback;
